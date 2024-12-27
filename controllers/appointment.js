import Appointment from '../schema/appointment.js'; // Import Appointment model
import Wallet from '../schema/wallet.js'; // Import Wallet model

// Book a new appointment
export const bookAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate , discountUsed } = req.body;

        const appointmentExists = await Appointment.findOne({ patientId, doctorId });
        if (appointmentExists && discountUsed) {
            return res.status(400).json({ message: 'Discount already used for this doctor' });
        }
        
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();

        // Deduct the amount from patient's wallet if discount is used
        if (discountUsed) {
            const patientWallet = await Wallet.findOne({ patientId });
            const discountAmount = 50; 
            patientWallet.balance -= discountAmount;
            await patientWallet.save();
        }

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error });
    }
};

// Get all appointments
export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

// Get a single appointment by ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment', error });
    }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error });
    }
};
