import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: [true, 'Patient is required'],
        index: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, 'Doctor is required'],
        index: true
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function(date) {
                return date > new Date();
            },
            message: 'Appointment date must be in the future'
        },
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["scheduled", "completed", "cancelled"],
            message: '{VALUE} is not a valid status'
        },
        default: "scheduled",
        index: true
    },
    reason: {
        type: String,
        required: [true, 'Reason for appointment is required'],
        trim: true
    },
    duration: {
        type: Number,
        default: 30, // minutes
        min: [15, 'Duration must be at least 15 minutes']
    },
    notes: {
        type: String,
        trim: true
    },
    fees: {
        amount: {
            type: Number,
            required: [true, 'Fees amount is required'],
            min: [0, 'Fees cannot be negative']
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paymentDate: Date
    },
    cancellation: {
        reason: String,
        cancelledBy: {
            type: String,
            enum: ['patient', 'doctor']
        },
        cancelledAt: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes
appointmentSchema.index({ doctor: 1, appointmentDate: 1 }, { unique: true });
appointmentSchema.index({ patient: 1, appointmentDate: 1 });

// Middleware to prevent double booking
appointmentSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('appointmentDate')) {
        const existingAppointment = await this.constructor.findOne({
            doctor: this.doctor,
            appointmentDate: this.appointmentDate,
            _id: { $ne: this._id },
            status: { $ne: 'cancelled' }
        });
        
        if (existingAppointment) {
            next(new Error('This time slot is already booked'));
        }
    }
    next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;