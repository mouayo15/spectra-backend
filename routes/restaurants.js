// In restaurants.js
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('../db');
const router = express.Router();
router.use(bodyParser.json());

// Route to get all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profils_restaurant');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving restaurants:', error);
    res.status(500).json({ message: 'Error retrieving restaurants', error: error.message });
  }
});

// Route to create a new restaurant
router.post('/restaurants', async (req, res) => {
  const { name, address, telephone, username, password } = req.body; // Add username and password from request body
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN'); // Start a transaction
  
    // Insert into Profils_Restaurant table
    const profileQuery = 'INSERT INTO profils_restaurant (nom_restaurant, adresse, telephone) VALUES ($1, $2, $3) RETURNING id';
    const profileValues = [name, address, telephone];
    const profileResult = await client.query(profileQuery, profileValues);
  
    // Get the ID of the newly inserted restaurant profile
    const restaurantId = profileResult.rows[0].id;
  
    // Insert into Restaurant_Accounts table
    const accountQuery = 'INSERT INTO Restaurant_Accounts (restaurant_id, username, password) VALUES ($1, $2, $3) RETURNING *';
    const accountValues = [restaurantId, username, password];
    const accountResult = await client.query(accountQuery, accountValues);
  
    await client.query('COMMIT'); // Commit the transaction
  
    res.status(201).json({ restaurant: profileResult.rows[0], account: accountResult.rows[0] }); // Return both inserted records
  } catch (error) {
    if (client) await client.query('ROLLBACK'); // Rollback the transaction if an error occurs
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Error creating restaurant', error: error.message });
  } finally {
    if (client) client.release(); // Release the client back to the pool
  }
});


// Add other routes for updating and deleting restaurants as needed...

module.exports = router;
