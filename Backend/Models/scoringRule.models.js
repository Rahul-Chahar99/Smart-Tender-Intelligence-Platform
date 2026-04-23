import mongoose from "mongoose";

const scoringRuleSchema = new mongoose.Schema({
  ruleName: {
    type: String,
    required: true,
  },
  condition: {
    field: { type: String, required: true },
    operator: { type: String, required: true }, // e.g., ">=", "<=", "==", "!="
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  weight: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

export const ScoringRule = mongoose.model("ScoringRule", scoringRuleSchema);