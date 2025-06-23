import Transaction from "../models/transaction.model.js";

export const getTransactions = async (req,res) => {
    try {
        const transactions = await Transaction.find();
        res.json({success: true, total: transactions.length, transactions});
    } catch (error) {
        console.log("Erreur lors de la récupération des transactions", error);
        res.status(500).json({success: false, message: "Erreur interne du serveur"})
    }
};

export const createTransaction = async (req,res) => {
    const { 
        numero_de_cloture, 
        date, 
        point_de_vente, 
        agent,
        total_hors_taxes,
        montant_de_la_taxe,
        total_ttc,
        billet,
        vente_diverses,
        reajustement,
        xbag,
        penalite,
        remboursement,
        especes,
        mobile,
        cb,
        virement,
        cheque
    } = req.body;

    if (!numero_de_cloture || !point_de_vente || !agent || !total_hors_taxes || !montant_de_la_taxe || !total_ttc) {
        return res.status(400).json({
            success: false, 
            message: "Données manquantes",
            errors: {
                numero_de_cloture: !numero_de_cloture ? "Le numéro de clôture est requis" : null,
                point_de_vente: !point_de_vente ? "Le point de vente est requis" : null,
                agent: !agent ? "L'agent est requis" : null,
                total_hors_taxes: !total_hors_taxes ? "Le total hors taxes est requis" : null,
                montant_de_la_taxe: !montant_de_la_taxe ? "Le montant de la taxe est requis" : null,
                total_ttc: !total_ttc ? "Le total TTC est requis" : null
            }
        });
    }

    const transaction = new Transaction({
        numero_de_cloture,
        date: new Date(date),
        point_de_vente,
        agent,
        total_hors_taxes,
        montant_de_la_taxe,
        total_ttc,
        billet,
        vente_diverses,
        reajustement,
        xbag,
        penalite,
        remboursement,
        especes,
        mobile,
        cb,
        virement,
        cheque
    });

    try {
        await transaction.save();
        res.status(201).json({
            success: true,
            message: "Transaction enregistrée",
            data: transaction
        });
    } catch (error) {
        console.log("Erreur lors de l'enregistrement de la transaction", error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur"
        });
    }
};

export const deleteTransaction = async (req,res) => {
    const transactionId = req.params.id;

    try {
        await Transaction.findByIdAndDelete(transactionId);
        res.json({success: true, message: "Transaction supprimée"})
    } catch (error) {
        console.log("Erreur lors de la suppression de la transaction", error);
        res.status(500).json({success: false, message: "Erreur interne du serveur"})
    }
};

export const updateTransaction = async (req,res) => {
    const transactionId = req.params.id;
    const updatedTransaction = req.body;

    try {
        // Vérifier si la transaction existe avant de la mettre à jour
        const existingTransaction = await Transaction.findById(transactionId);
        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction non trouvée"
            });
        }

        // Mettre à jour uniquement les champs qui sont présents dans le body
        const allowedUpdates = ['numero_de_cloture', 'date', 'point_de_vente', 'agent',
            'total_hors_taxes', 'montant_de_la_taxe', 'total_ttc',
            'billet', 'vente_diverses', 'reajustement', 'xbag', 'penalite', 'remboursement',
            'especes', 'mobile', 'cb', 'virement', 'cheque'];

        const updateObject = {};
        allowedUpdates.forEach(field => {
            if (updatedTransaction.hasOwnProperty(field)) {
                updateObject[field] = updatedTransaction[field];
            }
        });

        const transaction = await Transaction.findByIdAndUpdate(
            transactionId,
            updateObject,
            { new: true, runValidators: true } // Pour retourner la transaction mise à jour et valider les champs mis à jour
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction non trouvée"
            });
        }

        res.json({
            success: true,
            message: "Transaction mise à jour",
            data: transaction
        });
    } catch (error) {
        console.log("Erreur lors de la mise à jour de la transaction", error);
        res.status(500).json({
            success: false,
            message: error.message || "Erreur interne du serveur"
        });
    }
};