const fs = require('fs');
const axios = require('axios');
const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Import cors


const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS

const orgName = 'mediagur'; // Your organization name
const repo = 'images';
const authToken = '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';

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to upload a file to the repository
async function uploadFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const encodedContent = Buffer.from(fileContent).toString('base64');

    const response = await axios.put(
      `https://api.github.com/repos/${orgName}/${repo}/contents/${filePath}`,
      {
        message: 'Upload new file',
        content: encodedContent,
        branch: 'main',
      },
      {
        headers: {
          Authorization: `token ${authToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/${orgName}/${repo}@${response.data.commit.sha}/${filePath}`;
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

    const uploadedFile = await uploadFile(req.file.path);

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
