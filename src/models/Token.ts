import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 10 * 60 * 1000, // 10 minutos en el futuro
    expires: 0, // TTL de MongoDB, 0 porque ya calculas la expiración manualmente
  },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
