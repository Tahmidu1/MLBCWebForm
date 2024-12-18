const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Data storage files
const submissionsFile = './submissions.json';
const documentsFile = './documents.json';

// Ensure files exist
if (!fs.existsSync(submissionsFile)) fs.writeFileSync(submissionsFile, '[]');
if (!fs.existsSync(documentsFile)) fs.writeFileSync(documentsFile, '{"Individual": [], "Company": [], "Trust": []}');

// API to get required documents
app.get('/documents', (req, res) => {
    fs.readFile(documentsFile, (err, data) => {
        if (err) return res.status(500).send('Error reading documents');
        res.status(200).json(JSON.parse(data));
    });
});

// API to update documents
app.post('/documents', (req, res) => {
    const { clientType, documents } = req.body;

    fs.readFile(documentsFile, (err, data) => {
        if (err) return res.status(500).send('Error updating documents');
        const allDocuments = JSON.parse(data);
        allDocuments[clientType] = documents;
        fs.writeFile(documentsFile, JSON.stringify(allDocuments, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).send('Error saving documents');
            res.status(200).send('Documents updated successfully');
        });
    });
});

// API to handle form submission
app.post('/submit-form', upload.array('documents'), (req, res) => {
    const formData = req.body;
    const files = req.files.map(file => ({ filename: file.originalname, path: `/uploads/${file.filename}` }));
    const submission = { ...formData, documents: files };

    fs.readFile(submissionsFile, (err, data) => {
        const submissions = !err && data ? JSON.parse(data) : [];
        submissions.push(submission);

        fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).send('Error saving submission');
            res.status(200).json({ id: submissions.length - 1, ...submission });
        });
    });
});

// API to get all submissions
app.get('/submissions', (req, res) => {
    fs.readFile(submissionsFile, (err, data) => {
        if (err) return res.status(500).send('Error reading submissions');
        res.status(200).json(JSON.parse(data));
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
