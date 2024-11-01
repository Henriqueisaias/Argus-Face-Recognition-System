import mongoose from "mongoose";

// se der erro no schema é pq não fiz o import do schema com desetructuring
const userSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    password: { type: String, required: true },
    permision: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);