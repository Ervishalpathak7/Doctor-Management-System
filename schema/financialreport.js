import mongoose from "mongoose";

const financialReportSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FinancialReport = mongoose.model("FinancialReport", financialReportSchema);

export default FinancialReport;
