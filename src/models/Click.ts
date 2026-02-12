import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClick extends Document {
  _id: mongoose.Types.ObjectId;
  linkId: mongoose.Types.ObjectId;
  timestamp: Date;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  refererDomain: string | null;
}

const ClickSchema = new Schema<IClick>({
  linkId: {
    type: Schema.Types.ObjectId,
    ref: "Link",
    required: true,
    index: true,
  },
  timestamp: { type: Date, default: Date.now, index: true },
  ip: { type: String, default: null },
  userAgent: { type: String, default: null },
  referer: { type: String, default: null },
  country: { type: String, default: null },
  city: { type: String, default: null },
  device: {
    type: String,
    enum: ["desktop", "mobile", "tablet", "bot", "unknown"],
    default: "unknown",
  },
  browser: { type: String, default: null },
  os: { type: String, default: null },
  refererDomain: { type: String, default: null },
});

ClickSchema.index({ linkId: 1, timestamp: -1 });
ClickSchema.index({ linkId: 1, country: 1 });
ClickSchema.index({ linkId: 1, device: 1 });
ClickSchema.index({ linkId: 1, browser: 1 });
ClickSchema.index({ linkId: 1, refererDomain: 1 });

const Click: Model<IClick> =
  mongoose.models.Click || mongoose.model<IClick>("Click", ClickSchema);

export default Click;
