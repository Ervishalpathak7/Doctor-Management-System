import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: {
            values: ['credit', 'debit'],
            message: '{VALUE} is not a valid transaction type'
        },
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount cannot be negative']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    referenceId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    metadata: {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        },
        paymentMethod: String,
        paymentDetails: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const walletSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
        index: true
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, 'Balance cannot be negative']
    },
    transactions: [transactionSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    lastTransaction: {
        type: Date,
        default: Date.now
    },
    limits: {
        dailyLimit: {
            type: Number,
            default: 1000
        },
        monthlyLimit: {
            type: Number,
            default: 5000
        }
    }
}, {
    timestamps: true
});

// Indexes
walletSchema.index({ 'transactions.date': 1 });
walletSchema.index({ 'transactions.referenceId': 1 }, { unique: true });


// Prevent negative balance
walletSchema.pre('save', function(next) {
    if (this.balance < 0) {
        next(new Error('Insufficient balance'));
    }
    next();
});

// Transaction processing method
walletSchema.methods.processTransaction = async function(type, amount, description, metadata = {}) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (type === 'debit' && this.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const referenceId = new mongoose.Types.ObjectId().toString();
        
        // Check limits
        if (type === 'debit') {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const startOfMonth = new Date(today.setDate(1));

            const dailyTotal = await this.getDailyTransactionTotal(startOfDay);
            const monthlyTotal = await this.getMonthlyTransactionTotal(startOfMonth);

            if (dailyTotal + amount > this.limits.dailyLimit) {
                throw new Error('Daily transaction limit exceeded');
            }
            if (monthlyTotal + amount > this.limits.monthlyLimit) {
                throw new Error('Monthly transaction limit exceeded');
            }
        }

        this.balance += type === 'credit' ? amount : -amount;
        this.lastTransaction = new Date();
        
        this.transactions.push({
            transactionType: type,
            amount,
            description,
            referenceId,
            status: 'completed',
            metadata
        });

        await this.save({ session });
        await session.commitTransaction();
        
        return referenceId;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

// Helper methods for transaction totals
walletSchema.methods.getDailyTransactionTotal = async function(startOfDay) {
    return this.transactions.reduce((total, transaction) => {
        if (transaction.transactionType === 'debit' && 
            transaction.status === 'completed' && 
            transaction.createdAt >= startOfDay) {
            return total + transaction.amount;
        }
        return total;
    }, 0);
};

walletSchema.methods.getMonthlyTransactionTotal = async function(startOfMonth) {
    return this.transactions.reduce((total, transaction) => {
        if (transaction.transactionType === 'debit' && 
            transaction.status === 'completed' && 
            transaction.createdAt >= startOfMonth) {
            return total + transaction.amount;
        }
        return total;
    }, 0);
};

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;