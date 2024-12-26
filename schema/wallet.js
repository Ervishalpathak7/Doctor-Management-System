import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String, // "credit" or "debit"
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
