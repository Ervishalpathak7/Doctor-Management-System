import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        trim: true
    },
    qualifications: [{
        degree: {
            type: String,
            required: true
        },
        institution: String,
        year: Number
    }],
    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [0, 'Experience cannot be negative']
    },
    fees: {
        type: Number,
        required: [true, 'Fees are required'],
        min: [0, 'Fees cannot be negative']
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\+?[\d\s-]{10,}$/, 'Please provide a valid phone number']
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String
        }
    },
    availableSlots: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profileImage: String,
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true
    }
}, {
    timestamps: true
});

// Indexes
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'contact.city': 1 });
doctorSchema.index({ isActive: 1 });

// Password hashing middleware
doctorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;