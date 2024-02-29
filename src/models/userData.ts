import mongoose, { Schema, Document } from "mongoose";

// Interface to represent a document in MongoDB
interface IUserData extends Document {
  userId: String;
  allowedTokens: number;
  consumedTokens: number;
  name: String;
  subscriptionStatus: number;
  profilePicture: String;
}

// Create a schema corresponding to the document interface
const userDataSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String,
    required: false,
    validate: {
      validator: function (name: string) {
        // Regular expression for name validation contains letters,numbers and - , and it has a max of 40 characters
        return /^[a-zA-Z0-9-._+%\s]{1,40}$/.test(name);
      },
      message: (props: any) => `${props.value} is not a valid name!`,
    },},
    subscriptionStatus: {
      type: Number,
      required: true,
      default: 0, // 0 is free, 1 for first package, 2 for premium
      enum: [0, 1, 2]
  },
  profilePicture: { type: String, required: false },
  allowedTokens: { type: Number, required: true },
  consumedTokens: { type: Number, required: true },
});

// Create a model from the schema
const UserData = mongoose.model<IUserData>("UserData", userDataSchema);

export default UserData;
