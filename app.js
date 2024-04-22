const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurants');


const app = express();

app.use(bodyParser.json());

app.use('/api', userRoutes);

app.use('/api', restaurantRoutes);

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
