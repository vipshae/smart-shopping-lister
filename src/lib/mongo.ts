import mongoose from "mongoose";
import { MONGODB_URI } from '$env/static/private';

const mongoConnection = {
    isConnected: 0,
} 

export const dbConnect = async () => {
    console.log('MONGO URI', MONGODB_URI);
    if(mongoConnection.isConnected) {
        console.log('Already connected to db');
    }

    if(mongoose.connections.length > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;
        if(mongoConnection.isConnected === 1) {
            console.log('Using existing db conn.');
        }
        await mongoose.disconnect();
    }

    await mongoose.connect(MONGODB_URI ?? '');
    mongoConnection.isConnected = 1;
    console.log('Connected to mongodb server');
};

export const dbDisconnect = async () => {
    if(mongoConnection.isConnected === 0) {
        return;
    }

    await mongoose.disconnect();
    console.log('Disconnected from db');
};
