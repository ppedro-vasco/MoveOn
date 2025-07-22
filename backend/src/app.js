require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthDataRoutes = require('./routes/healthDataRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes'); // NOVO IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/health-data', healthDataRoutes);
app.use('/api/restaurante', restaurantRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API do Ambulatório Online - Node.js" });
});

app.listen(PORT, () => {
    console.log(`Backend Node.js rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}/`);
});