import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();  // Charge les variables d'environnement à partir d'un fichier .env

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Exemple de route API
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running' });
});

// Démarrer le serveur sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
