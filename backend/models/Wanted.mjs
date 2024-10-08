import mongoose from "mongoose";

const wantedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    crimes: { type: String, required: true },
    seen: { type: Date, required: true },
    location: { type: String },
    photo: {type: String}
  },
  { timestamps: true }
);

export const Wanted = mongoose.model("Wanted", wantedSchema);
