const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const getAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.readonly",
  ];

  return auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
};

const getTokens = async (code) => {
  const { tokens } = await auth.getToken(code);
  return tokens;
};

const setCredentials = (tokens) => {
  auth.setCredentials(tokens);
  return auth;
};

const getDriveClient = (auth) => {
  return google.drive({ version: "v3", auth });
};


module.exports = {
    auth,
    getAuthUrl,
    getTokens,
    setCredentials,
    getDriveClient,
};