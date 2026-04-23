import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema({
  tenderId: {
    type: String,
    unique: true,
    required: true,
  },

  // source (String - e.g., "GeM", "MockAPI")
  source: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
    text: true,
  },
  description: {
    type: String,
    text: true,
  },

  category: {
    type: String,
  },

  value: {
    type: Number,
  },

  deadlines: {
    submissionDate: { type: Date },
    openingDate: { type: Date },
  },

 
  requirements: [{ turnover: Number, certifications: [String] }],
}, { timestamps: true });

export const Tender = mongoose.model("Tender", tenderSchema);
