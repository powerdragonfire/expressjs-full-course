import mongoose, { Document } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  displayName?: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUserDocument>({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  displayName: mongoose.Schema.Types.String,
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
