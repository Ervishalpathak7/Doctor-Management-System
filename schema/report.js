import mongoose from 'mongoose';


const patientReportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required'],
        index: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor is required'],
        index: true
    },
    reportDate: {
        type: Date,
        required: [true, 'Report date is required'],
        index: true
    },
    symptoms: {
        type: [String],
        required: [true, 'Symptoms are required']
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required']
    },
    treatment: {
        type: String,
        required: [true, 'Treatment is required']
    },
    followUpDate: {
        type: Date,
        required: [true, 'Follow-up date is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
    }, 
    {
    timestamps: true
});

const PatientReport = mongoose.model('PatientReport', patientReportSchema);
export default PatientReport;