import mongoose, { Document, Schema } from "mongoose";

export interface ILoginLog extends Document {
  user: mongoose.Schema.Types.ObjectId;
  role: string;
  ipAddress: string;
  userAgent: string;
  loggedInAt: Date;
}

const loginLogSchema = new Schema<ILoginLog>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: String,
  ipAddress: String,
  userAgent: String,
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ILoginLog>("LoginLog", loginLogSchema);
