const express = require("express");
const { getIndex } = require("../config/pinecone");
const { getEmbedding } = require("../config/openai");
const { setCredentials, getDriveClient } = require("../config/auth");

const router = express.Router();

const isAuthorised = (req, res, next) => {
    if(!req.session.tokens) {
        return res.status(401).json({message: "Unauthorized"});
    }

    next();
}



router.post("/ingest", isAuthorised, async (req, res) => {
    const userId = req.session.user.id;
    console.log("------------", userId, "------------");
  try {
    const auth = setCredentials(req.session.tokens);
    const drive = getDriveClient(auth);

    const resp = await drive.files.list({
      q: "mimeType='text/plain' or mimeType='text/markdown'",
      fields: "files(id, name, mimeType, webViewLink)",
    });

    const files = resp.data.files;
    const pineconeIndex = await getIndex();
    const userId = req.session.user.id;
    console.log("------------", userId, "------------");
    for (const file of files) {
      try {
        const contentResp = await drive.files.get({
          fileId: file.id,
          alt: "media",
        });

        const content = contentResp.data;

        const embedding = await getEmbedding(content);

        await pineconeIndex.upsert([
          {
            id: `${userId}-${file.id}`,
            values: embedding,
            metadata: {
              userId,
              fileId: file.id,
              fileName: file.name,
              mimeType: file.mimeType,
              webViewLink: file.webViewLink,
            },
          },
        ]);
        console.log(`Ingested ${file.name}`);
      } catch (error) {
        console.error(`Error in processing ${file.name}, ${error}`);
      }
    }
    res.json({ message: "Ingested all files", count: files.length });
  } catch (error) {
    console.error("Error ingesitng files", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/query", isAuthorised, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const queryEmbedding = await getEmbedding(query);

    const pineconeIndex = await getIndex();
    const userId = req.session.user.id;

    const results = await pineconeIndex.query({
      vector: queryEmbedding,
      filter: { userId },
      topK: 5,
      includeMetadata: true,
    });

    const responses = results.matches.map((match) => ({
      score: match.score,
      fileId: match.metadata.fileId,
      fileName: match.metadata.fileName,
      webViewLink: match.metadata.webViewLink,
    }));

    res.json(responses);
  } catch (error) {
    console.error("Error searching files:", error);
    res.status(500).json({ error: "Failed to search files" });
  }
});


module.exports = router;