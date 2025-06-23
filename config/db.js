import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erreur : ${error.message}`);
        process.exit(1);
    }
}