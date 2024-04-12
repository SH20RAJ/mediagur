const fs = require('fs');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = 3000;

console.log("Starting express");
// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
// Middleware
app.use(express.static('public')); // Serve static files from the 'public' directory

const orgName = process.env.ORG_NAME; // Your organization name from .env
const repo = process.env.REPO_NAME; // Your repository name from .env
const authToken = process.env.GITHUB_AUTH_TOKEN; // Your GitHub auth token from .env

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Function to upload a file to the repository
async function uploadFile(filename, fileContent) {
  try {
    const encodedContent = Buffer.from(fileContent).toString('base64');

    // Check if file already exists
    const existingFileResponse = await axios.get(
      `https://api.github.com/repos/${orgName}/${repo}/contents/${filename}`,
      {
        headers: {
          Authorization: `token ${authToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let sha = null;
    if (existingFileResponse.data.sha) {
      sha = existingFileResponse.data.sha;
    }

    // Create or update file
    const response = await axios.put(
      `https://api.github.com/repos/${orgName}/${repo}/contents/${filename}`,
      {
        message: 'Upload new file',
        content: encodedContent,
        branch: 'main',
        sha: sha, // Provide sha for updating existing file
      },
      {
        headers: {
          Authorization: `token ${authToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(response);

    const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/${orgName}/${repo}@${response.data.commit.sha}/${filename}`;
    return { url: response.data.content.html_url, jsdelivr: jsDelivrUrl };
  } catch (error) {
    console.error('Error uploading file:', error.message);
    return null;
  }
}

// POST endpoint for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read file content
    const fileContent = fs.readFileSync(req.file.path);

    // Log file content for debugging
    console.log('File Content:', fileContent);

    const uploadedFile = await uploadFile(req.file.originalname, fileContent);

    // Delete the file from server after upload
    fs.unlinkSync(req.file.path);

    if (!uploadedFile) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    return res.json({ success: true, file: uploadedFile });
  } catch (error) {
    console.error('An error occurred:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
