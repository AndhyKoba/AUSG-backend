import mongoose from 'mongoose';
// Removed bcrypt import as we no longer need password hashing

const UserSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        unique: true,
        required: true
    }, 
    mot_de_passe: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "agent"],
        default: "agent"
    },
    connecté : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

// Removed password hashing middleware as we no longer need it

// Removed password comparison method as we no longer need it

const User = mongoose.model('Utilisateur', UserSchema);

export default User;
