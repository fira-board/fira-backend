import mongoose, { Schema, Document } from "mongoose";

// Interface to represent a document in MongoDB
interface IUserData extends Document {
  userId: String;
  allowedTokens: number;
  consumedTokens: number;
}

// Create a schema corresponding to the document interface
const userDataSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  allowedTokens: { type: Number, required: true },
  consumedTokens: { type: Number, required: true },
});

// Create a model from the schema
const UserData = mongoose.model<IUserData>("UserData", userDataSchema);

export default UserData;
