// In comments.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../db');
const router = express.Router();
router.use(bodyParser.json());

// Route to get all comments
router.get('/comments', async (req, res) => {
  // Implement the route logic to retrieve all comments from the database
});

// Route to create a new comment
router.post('/comments', async (req, res) => {
  // Implement the route logic to create a new comment in the database
});

// Add other routes for updating and deleting comments as needed...

module.exports = router;
