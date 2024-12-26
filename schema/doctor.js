import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    },
    specialization: {
    type: String,
    required: true,
    },
    experience: {
    type: Number, 
    required: true,
    },
    specialization: {
    type: String,
    required: true,
    },
    fees: {
    type: Number,
    required: true,
    },
    contact: {
    type: String,
    required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;