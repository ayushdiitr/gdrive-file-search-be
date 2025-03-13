
# Google Drive File Search with Semantic Embeddings


A functional web-based tool that allows users to:

- Log in via Google OAuth and grant Google Drive access.
- Fetch text-based files (.txt, .md) from their Drive.
- Store file embeddings in Pinecone for semantic search.
- Enable users to search for relevant files using vector similarity.




## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** Node.js (Express.js)
- **Auth & API Access:** Google OAuth 2.0, Google Drive API
- **Vector Store:** Pinecone
- **Embeddings:** OpenAI’s `text-embedding-ada-002` (dimension - 1536)




## Prerequisites

- Node.js (v16+)
- Google account with OAuth credentials
- Pinecone account
- OpenAI API key


### Setup Instructions

#### 1. Create Google OAuth Credentials

      1. Go to Google Cloud Console and Create a new project there
      2. Configure OAuth consent screen
      3. Create OAuth credentials (Web application type)
      4. Enable the Google Drive API
      5. Add authorized redirect URI: http://localhost:5000/api/auth/google/callback
      6. Note down your Client ID and Client Secret

#### 2. Setup Pinecone

      1. Create a Pinecone account at pinecone.io
      2. Create an API key

#### 3. Get OpenAI API Key

      1. Create an OpenAI account at platform.openai.com
      2. Generate an API key
      3. In order to use API Keys, you will need to buy a paid plan

## Run Frontend Locally

Clone the project

```bash
  git clone https://github.com/ayushdiitr/gdrive-file-search-fe
  
```

Go to the project directory

```bash
  cd gdrive-file-search-fe
```
Create `.env`

```bash
VITE_API_URL=http://localhost:5000
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```


## Run Backend Locally

Clone the project

```bash
  git clone https://github.com/ayushdiitr/gdrive-file-search-be
  
```

Go to the project directory

```bash
  cd gdrive-file-search-be
```
Create `.env`

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret

# Google OAuth credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

OPENAI_API_KEY=

PINECONE_API_KEY=
PINECONE_INDEX_NAME=drive-search

```

Install dependencies

```bash
  npm install
```

Start the  server

```bash
  npm start
```


## Limitations

- Currently only supports .txt and .md files
- File size limit of 10MB (Google Drive API limitation)
