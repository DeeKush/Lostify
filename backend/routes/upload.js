const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});


// Convert buffer to base64
const toBase64 = buffer => buffer.toString('base64');

// Upload to GitHub repo
async function uploadToGithub(filename, contentBase64) {
  const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filename}`;

  const response = await axios.put(
    url,
    {
      message: `upload ${filename}`,
      content: contentBase64
    },
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log("GitHub upload response: ", response.data);
  return response.data;
}

router.post('/', upload.single('image'), async (req, res) => {
  console.log("Upload request received");
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `lostify-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const base64 = toBase64(req.file.buffer);

    const gh = await uploadToGithub(filename, base64);

    const rawUrl = gh.content.download_url;
    console.log("File uploaded to GitHub: ", rawUrl);

    res.json({ imageUrl: rawUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

module.exports = router;
