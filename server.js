// Importation des modules nécessaires
import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Utilisé pour manipuler les chemins de fichiers

// Importation de la connexion à la base de données et des fichiers de routes
import { connectDB } from './config/db.js';
import userRoute from './routes/user.route.js';
import transactionRoute from './routes/transaction.route.js';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Afficher l'environnement actuel (utile pour le débogage)
console.log("NODE_ENV:", process.env.NODE_ENV);

// Initialiser l'application Express
const app = express();

// Définir le port d'écoute, depuis les variables d'environnement ou par défaut à 5000
const port = process.env.PORT || 5000;

// Résoudre le chemin absolu du répertoire courant pour la gestion des fichiers statiques.
// Dans les modules ES, __dirname n'est pas directement disponible, on le dérive.
// path.resolve() sans argument renvoie le répertoire de travail actuel.
const __dirname = path.resolve();

// --- Configuration des middlewares ---

// Activer CORS (Cross-Origin Resource Sharing)
// Permet à votre frontend (ex: localhost:5173) de faire des requêtes vers ce backend.
app.use(cors({
    origin: 'https://ausg-frontend.vercel.app', // Permettre les requêtes uniquement depuis cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes de requête autorisés
}));

// Parser les corps de requêtes entrants en JSON (pour les requêtes POST, PUT, PATCH)
app.use(express.json());

// --- Définition des routes API ---

// Route racine simple pour vérifier que le serveur est bien démarré
app.get("/", (req, res) => {
    res.send("Serveur en marche");
});

// Monter les routes utilisateur sous le préfixe /api/users
// Toutes les routes définies dans user.route.js seront accessibles via /api/users/...
app.use("/api/users", userRoute);

// Monter les routes de transaction sous le préfixe /api/transactions
// Toutes les routes définies dans transaction.route.js seront accessibles via /api/transactions/...
app.use("/api/transactions", transactionRoute);

// --- Servir les fichiers statiques en production ---
// Ce bloc est actif uniquement lorsque l'application est en mode production.
// Il permet au backend de servir les fichiers de build de votre application frontend (React, etc.).
if (process.env.NODE_ENV === 'production') {
    // Servir les fichiers statiques (JS, CSS, images, etc.) depuis le répertoire 'frontend/dist'.
    // 'frontend/dist' est le répertoire où sont générés les fichiers de build de votre frontend.
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    // Route "catch-all" pour toutes les requêtes GET non gérées par les routes API ou les fichiers statiques.
    // Cette ligne est CRUCIALE pour les Single Page Applications (SPA).
    // Elle s'assure que pour toute route non reconnue (par exemple, une route de votre frontend comme /dashboard),
    // le fichier index.html de votre frontend est renvoyé, permettant au routeur côté client de prendre le relais.
    app.get('*', (req, res) => {
        // Résoudre le chemin absolu vers index.html pour éviter les problèmes de chemin relatif.
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// --- Démarrage du serveur ---

// Lancer le serveur Express et écouter sur le port défini
app.listen(port, () => {
    // Établir la connexion à la base de données une fois le serveur démarré
    connectDB();
    console.log(`Serveur connecté sur http://localhost:${port}`);
});
