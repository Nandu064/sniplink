import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILink extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  originalUrl: string;
  slug: string;
  customAlias: boolean;
  title: string | null;
  totalClicks: number;
  isActive: boolean;
  expiresAt: Date | null;
  passwordHash: string | null;
  passwordProtected: boolean;
  pinnedToBio: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalUrl: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 50,
    },
    customAlias: { type: Boolean, default: false },
    title: { type: String, default: null, maxlength: 200 },
    totalClicks: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    passwordHash: { type: String, default: null, select: false },
    passwordProtected: { type: Boolean, default: false },
    pinnedToBio: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LinkSchema.index({ userId: 1, createdAt: -1 });

const Link: Model<ILink> =
  mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema);

export default Link;
