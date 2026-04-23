import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tender",
    required: true,
  },
  status: {
    type: String,
    enum: ['Discovered', 'Analyzing', 'Drafting', 'Review', 'Submitted'],
    default: 'Discovered',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  }
}, { timestamps: true });

export const Workflow = mongoose.model("Workflow", workflowSchema);