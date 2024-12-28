import Appointment from '../schema/appointment.js'; // Import Appointment model
import Wallet from '../schema/wallet.js'; // Import Wallet model
import mongoose from 'mongoose';
import { validateAppointmentDate, validateDiscountEligibility } from '../utils/appointment.js';

// Book a new appointment
export const bookAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { patientId, doctorId, appointmentDate, discountUsed } = req.body;

        // Input validation
        if (!patientId || !doctorId || !appointmentDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate appointment date
        if (!validateAppointmentDate(appointmentDate)) {
            return res.status(400).json({ message: 'Invalid appointment date' });
        }

        // Check for existing appointments in the same time slot
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate: {
                $gte: new Date(appointmentDate),
                $lt: new Date(new Date(appointmentDate).getTime() + 60 * 60 * 1000) // 1 hour slot
            }
        }).session(session);

        if (existingAppointment) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Time slot already booked' });
        }

        // Check discount eligibility
        if (discountUsed) {
            const isEligible = await validateDiscountEligibility(patientId, doctorId);
            if (!isEligible) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Not eligible for discount' });
            }

            // Handle wallet deduction
            const patientWallet = await Wallet.findOne({ patientId }).session(session);
            if (!patientWallet || patientWallet.balance < DISCOUNT_AMOUNT) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Insufficient wallet balance' });
            }

            patientWallet.balance -= DISCOUNT_AMOUNT;
            await patientWallet.save({ session });
        }

        // Create appointment
        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            discountUsed,
            status: 'scheduled',
            createdAt: new Date()
        });

        await newAppointment.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            appointment: newAppointment,
            message: 'Appointment booked successfully'
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Appointment booking error:', error);
        res.status(500).json({ message: 'Error booking appointment' });
    } finally {
        session.endSession();
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
