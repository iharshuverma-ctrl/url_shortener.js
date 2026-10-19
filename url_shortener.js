
const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());

// Temporary in-memory storage
const urls = new Map();

// Validate URL
function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "URL Shortener API is running!",
        endpoints: ["POST /shorten", "GET /:code"]
    });
});

// Create short URL
app.post("/shorten", (req, res) => {
    const { originalUrl } = req.body;

    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({
            message: "Please provide a valid HTTP or HTTPS URL"
        });
    }

    let code;

    do {
        code = crypto.randomBytes(4).toString("hex");
    } while (urls.has(code));

    urls.set(code, originalUrl);

    res.status(201).json({
        message: "URL shortened successfully",
        originalUrl,
        shortCode: code,
        shortUrl: `http://localhost:${PORT}/${code}`
    });
});

// Redirect to original URL
app.get("/:code", (req, res) => {
    const originalUrl = urls.get(req.params.code);

    if (!originalUrl) {
        return res.status(404).json({
            message: "Short URL not found"
        });
    }

    res.redirect(originalUrl);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
          
