const express = require("express");

const isAuthorised = (req, res, next) => {
    if (!req.session.tokens) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
}

module.exports = isAuthorised;
