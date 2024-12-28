import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema({
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
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age cannot exceed 120']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender'
        }
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^\+?[\d\s-]{10,}$/, 'Please provide a valid phone number']
        },
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        required: [true, 'Address is required']
    },
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        diagnosedDate: Date,
        medications: [{
            name: String,
            dosage: String,
            frequency: String
        }]
    }],
    allergies: [{
        type: String,
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
        }
    }],
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    insurance: {
        provider: String,
        policyNumber: String,
        validUntil: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
patientSchema.index({ email: 1 }, { unique: true });
patientSchema.index({ 'contact.phone': 1 });
patientSchema.index({ isActive: 1 });

// Password hashing middleware
patientSchema.pre('save', async function(next) {
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
patientSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;