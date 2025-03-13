const { getAuthUrl, getTokens, setCredentials } = require('../config/auth');
const express = require("express");
const { google } = require('googleapis');

const router = express.Router();

router.get('/google', (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
    const {code} = req.query;

    try {
        const tokens = await getTokens(code);
        req.session.tokens = tokens;

        const auth = setCredentials(tokens);
        const oauth2 = google.oauth2({version: "v2", auth});
        const {data} = await oauth2.userinfo.get();

        req.session.user = {
            id: data.id,
            email : data.email,
            name: data.name,
            profilePicture: data.picture,
        }

        res.redirect(`${process.env.CLIENT_URL}`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.CLIENT_URL}/login`);
    }
});

router.get('/user', (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({message: "Unauthorized"});
    }

    res.json(req.session.user);
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({message: "Logged out"});
})

module.exports = router;