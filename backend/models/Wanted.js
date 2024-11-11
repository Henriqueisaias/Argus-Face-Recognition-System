import mongoose from "mongoose";

const wantedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    crimes: { type: String, required: true },
    condemned: { type: String, required: true },
    wanted: { type: Boolean },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: "GridFSFile" },
  },
  { timestamps: true }
);

export const Wanted = mongoose.model("Wanted", wantedSchema);
