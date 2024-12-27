// models/patientReport.js
import mongoose from 'mongoose';

const patientReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    consultationDate: {
        type: Date,
        default: Date.now,
    },
    symptoms: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatmentPlan: {
        type: String,
        required: true,
    },
    followUpDate: {
        type: Date,
    },
});

const PatientReport = mongoose.model('PatientReport', patientReportSchema);
export default PatientReport;
