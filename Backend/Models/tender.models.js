import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema({
  // tenderId (String, unique hash for deduplication)
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

  // title, description (Text indexed for search)
  title: {
    type: String,
    required: true,
    text: true,
  },
  description: {
    type: String,
    text: true,
  },

  // category (String)
  category: {
    type: String,
  },

  // value (Number)
  value: {
    type: Number,
  },

  // deadlines (Object: submissionDate, openingDate)
  deadlines: {
    submissionDate: { type: Date },
    openingDate: { type: Date },
  },

  // requirements (Array of objects: turnover, certifications)
  requirements: [{ turnover: Number, certifications: [String] }],
}, { timestamps: true });

export const Tender = mongoose.model("Tender", tenderSchema);
