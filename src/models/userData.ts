import mongoose, { Schema, Document } from 'mongoose';

// Interface to represent a document in MongoDB
interface IUserData extends Document {
  allowedTokens: number;
  consumedTokens: number;

    // Add methods here if needed
    //check if user has enough tokens
    hasEnoughTokens: (tokens: number) => boolean;
    //consume tokens
    consumeTokens: (tokens: number) => void;
}

// Create a schema corresponding to the document interface
const userDataSchema: Schema = new Schema({
  allowedTokens: { type: Number, required: true },
  consumedTokens: { type: Number, required: true }
});

// Create a model from the schema
const UserData = mongoose.model<IUserData>('UserData', userDataSchema);

export default UserData;
