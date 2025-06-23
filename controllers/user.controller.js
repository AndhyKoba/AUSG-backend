// backend/controllers/user.controller.js

import User from "../models/user.model.js";
// Removed bcrypt import as we no longer need password hashing

// Fonction de Connexion
export const connexion = async (req, res) => {
    const { pseudo, mot_de_passe } = req.body; // Renomme pour éviter la confusion avec le champ du modèle

    try {
        const user = await User.findOne({ pseudo });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        
        // Vérifiez si user.mot_de_passe existe avant de comparer
        if (!user.mot_de_passe) { // <-- Utilise user.mot_de_passe
            console.error("Erreur: Mot de passe non défini pour l'utilisateur:", pseudo);
            return res.status(500).json({ success: false, message: "Erreur serveur: Mot de passe non défini pour cet utilisateur." });
        }

        // Compare directement les mots de passe
        if (mot_de_passe !== user.mot_de_passe) {
            return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
        }
        
        
        user.connecté = true; 
        await user.save();

        res.json({ success: true, message: "Connexion réussie", user: { pseudo: user.pseudo, role: user.role } });

    } catch (error) {
        console.error("Erreur connexion:", error);
        res.status(500).json({ success: false, message: "Erreur serveur lors de la connexion" });
    }
};

// Fonction d'Inscription
export const inscription = async (req,res) => {
    const { pseudo, mot_de_passe, role } = req.body; 

    if(!pseudo || !mot_de_passe){
        return res.status(400).json({success: false, message: "Pseudo ou mot de passe manquant"})
    }

    try {
        const existingUser = await User.findOne({ pseudo });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Ce pseudo est déjà utilisé." });
        }

        const newUser = new User({ 
            pseudo, 
            mot_de_passe, // Stocke le mot de passe en clair
            role: role || 'agent',
            connecté: false
        });

        await newUser.save();
        res.status(201).json({success: true, message: "Utilisateur enregistré avec succès."})

    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur", error); 
        res.status(500).json({success: false, message: "Erreur interne du serveur lors de l'inscription."})
    }
};

// Fonction de Déconnexion
export const deconnexion = async (req, res) => {
    const { pseudo } = req.body;

    try {
        const user = await User.findOne({ pseudo });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }

        user.connecté = false;
        await user.save();

        res.status(200).json({ success: true, message: "Déconnexion réussie" });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
}; 

// Fonction de Suppression d'utilisateur
export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        res.json({ success: true, message: "Utilisateur supprimé" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
};

// Fonction de Mise à jour d'utilisateur
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    try {
        // Si le mot de passe est mis à jour, il doit être haché et stocké dans 'mot_de_passe'
        if (updatedUser.mot_de_passe) { // Vérifie si le champ 'mot_de_passe' est dans le body
            updatedUser.mot_de_passe = await bcrypt.hash(updatedUser.mot_de_passe, 10); // <-- Hache et met à jour user.mot_de_passe
        }

        const result = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
        if (!result) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
        res.json({ success: true, message: "Utilisateur mis à jour" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
};

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
    try {
        const utilisateurs = await User.find({});
        res.json({ success: true, total: utilisateurs.length, users: utilisateurs });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
};