import Wallet from '../schema/wallet.js'; // Import Wallet model

// Add funds to a wallet
export const addFunds = async (req, res) => {
    try {
        const { patientId, amount } = req.body;
        const wallet = await Wallet.findOne({ patientId });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        wallet.balance += amount;
        await wallet.save();
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error adding funds', error });
    }
};

// Get wallet balance
export const getBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ patientId: req.params.patientId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching balance', error });
    }
};

// Deduct amount from wallet
export const deductAmount = async (req, res) => {
    try {
        const { patientId, amount } = req.body;
        const wallet = await Wallet.findOne({ patientId });

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        wallet.balance -= amount;
        await wallet.save();
        res.status(200).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Error deducting funds', error });
    }
};
