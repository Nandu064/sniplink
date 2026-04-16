import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  username: string | null;
  bio: string | null;
  displayName: string | null;
  plan: 'free' | 'pro';
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    username: { type: String, default: null, unique: true, sparse: true, lowercase: true, trim: true, match: /^[a-z0-9_-]+$/ },
    bio: { type: String, default: null, maxlength: 200 },
    displayName: { type: String, default: null, maxlength: 100 },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    stripeCustomerId: { type: String, default: null, select: false },
  },
  { timestamps: true }
);

// Note: username unique sparse index is declared inline above via schema field options

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
