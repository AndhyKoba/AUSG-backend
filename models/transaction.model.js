import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    point_de_vente: {type: String, required: true},
    agent: { type: String, required: true },
    numero_de_cloture: { type: String, required: true, unique: true },
    
    billet: { type: Number, required: false },
    vente_diverses: { type: Number, required: false },
    reajustement: { type: Number, required: false },
    xbag: { type: Number, required: false },
    penalite: { type: Number, required: false },
    remboursement: { type: Number, required: false },

    especes: { type: Number, required: false },
    mobile: { type: Number, required: false },
    cb: { type: Number, required: false },
    virement: { type: Number, required: false },
    cheque: { type: Number, required: false },

    total_hors_taxes: { type: Number, required: true },
    // --- MODIFICATION ICI : RENOMMÉ total_avec_taxes en montant_de_la_taxe ---
    montant_de_la_taxe: { type: Number, required: true },
    // ----------------------------------------------------------------------
    total_ttc: { type: Number, required: true },
}, {
    timestamps: true
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;