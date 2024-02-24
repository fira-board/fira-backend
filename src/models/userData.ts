import mongoose, { Schema, Document } from "mongoose";

// Interface to represent a document in MongoDB
interface IUserData extends Document {
  userId: string;
  allowedTokens: number;
  consumedTokens: number;
  name: string;
  profilePicture: string;
}

// Create a schema corresponding to the document interface
const userDataSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String,
    required: true,
    validate: {
      validator: function (name: string) {
        // Regular expression for name validation contains letters,numbers and - , and it has a max of 40 characters
        return /^[a-zA-Z0-9-._+%\s]{1,40}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid name!`,
    },},
  profilePicture: { type: String, required: false },
  allowedTokens: { type: Number, required: true },
  consumedTokens: { type: Number, required: true },
});

// Create a model from the schema
const UserData = mongoose.model<IUserData>("UserData", userDataSchema);

export default UserData;
