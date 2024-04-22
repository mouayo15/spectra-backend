const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../db');
const router = express.Router();

// Middleware for parsing JSON bodies
router.use(bodyParser.json());

// Route to get all users
router.get('/utilisateurs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM utilisateurs');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
});

// Route to get a specific user by ID
router.get('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
});

// Route to create a new user
router.post('/utilisateurs', async (req, res) => {
  const { nom_utilisateur, email, mot_de_passe } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING *', [nom_utilisateur, email, mot_de_passe]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Route to update an existing user by ID
router.put('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  const { nom_utilisateur, email, mot_de_passe } = req.body;
  try {
    const { rows } = await pool.query('UPDATE utilisateurs SET nom_utilisateur = $1, email = $2, mot_de_passe = $3 WHERE id = $4 RETURNING *', [nom_utilisateur, email, mot_de_passe, id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Route to delete a user by ID
router.delete('/utilisateurs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM utilisateurs WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
