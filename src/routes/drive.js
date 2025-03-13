
const express = require("express");
const { setCredentials, getDriveClient } = require("../config/auth");

const router = express.Router();

const isAuthorised = (req, res, next) => {
    if(!req.session.tokens) {
        return res.status(401).json({message: "Unauthorized"});
    }

    next();
}

router.get('/files', isAuthorised, async(req, res) => {
    try{
        const auth = setCredentials(req.session.tokens);
        const drive = getDriveClient(auth);

        const response = await drive.files.list({
              q: "mimeType='text/plain' or mimeType='text/markdown'",
      fields: 'files(id, name, mimeType, webViewLink)',
        })

        const files = response.data.files;
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong!", error: err});
    }
});

router.get('/files/:fileId/content', isAuthorised, async(req, res) => {
    try {
        const {fileId} = req.params;

        const auth = setCredentials(req.session.tokens);
        const drive = getDriveClient(auth);

        const fileMetaData = await drive.files.get({
            fileId,
            fields: 'id, name, mimeType, webViewLink'
        });

        const response = await drive.files.get({
            fileId,
            alt: 'media'
        }, {responseType: 'stream'});

        let content = '';
        response.data.on('data', chunk => {
            content += chunk;
        });

        response.data.on('end', () => {
            res.json({
                ...fileMetaData.data,
                content
            });
        });

        response.data.on('error', (err) => {
            throw err;
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong!"});
    }
});

module.exports = router;