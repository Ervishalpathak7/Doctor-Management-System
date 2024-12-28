import Appointment from '../schema/appointment.js';

/**
 * Validates if the proposed appointment date is valid according to business rules
 * @param {Date} appointmentDate - The proposed appointment date
 * @returns {boolean} - Whether the date is valid
 */

export const validateAppointmentDate = (appointmentDate) => {
    const proposedDate = new Date(appointmentDate);
    const currentDate = new Date();

    // Basic date validity check
    if (isNaN(proposedDate.getTime())) {
        throw new Error('Invalid date format');
    }

    // Check if appointment is in the future
    if (proposedDate < currentDate) {
        throw new Error('Appointment date must be in the future');
    }

    // Check if appointment is within working hours (9 AM to 5 PM)
    const hours = proposedDate.getHours();
    if (hours < 9 || hours >= 17) {
        throw new Error('Appointments must be between 9 AM and 5 PM');
    }

    // Check if appointment is on a weekend
    const day = proposedDate.getDay();
    if (day === 0 || day === 6) {
        throw new Error('Appointments cannot be scheduled on weekends');
    }

    // Check if appointment is at least 24 hours in advance
    const minAdvanceTime = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
    if (proposedDate < minAdvanceTime) {
        throw new Error('Appointments must be scheduled at least 24 hours in advance');
    }

    // Check if appointment starts at the beginning of an hour
    if (proposedDate.getMinutes() !== 0 || proposedDate.getSeconds() !== 0) {
        throw new Error('Appointments must start at the beginning of an hour');
    }

    return true;
};

/**
 * Validates if a patient is eligible for a discount with a specific doctor
 * @param {string} patientId - The ID of the patient
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<boolean>} - Whether the patient is eligible for a discount
 */
export const validateDiscountEligibility = async (patientId, doctorId) => {
    try {
        // Check if patient has used a discount with this doctor before
        const previousDiscountAppointment = await Appointment.findOne({
            patientId,
            doctorId,
            discountUsed: true
        });

        if (previousDiscountAppointment) {
            throw new Error('Discount already used with this doctor');
        }

        // Check if patient has any active appointments
        const activeAppointments = await Appointment.find({
            patientId,
            appointmentDate: { $gte: new Date() },
            status: 'scheduled'
        });

        // Limit concurrent appointments to 3
        if (activeAppointments.length >= 3) {
            throw new Error('Maximum active appointments reached');
        }

        // Check appointment history with this doctor
        const appointmentHistory = await Appointment.find({
            patientId,
            doctorId,
            status: 'completed'
        });

        // New patient discount - eligible if no previous appointments
        if (appointmentHistory.length === 0) {
            return true;
        }

        // Loyalty discount - eligible after 5 completed appointments
        if (appointmentHistory.length >= 5) {
            return true;
        }

        // Check if last appointment was more than 3 months ago - retention discount
        const lastAppointment = await Appointment.findOne({
            patientId,
            doctorId,
            status: 'completed'
        }).sort({ appointmentDate: -1 });

        if (lastAppointment) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            
            if (lastAppointment.appointmentDate < threeMonthsAgo) {
                return true;
            }
        }

        throw new Error('Not eligible for discount');

    } catch (error) {
        throw error;
    }
};

/**
 * Utility function to check if a time slot is available
 * @param {Date} appointmentDate - The proposed appointment date
 * @param {string} doctorId - The ID of the doctor
 * @returns {Promise<boolean>} - Whether the time slot is available
 */
export const isTimeSlotAvailable = async (appointmentDate, doctorId) => {
    const appointmentStart = new Date(appointmentDate);
    const appointmentEnd = new Date(appointmentStart.getTime() + (60 * 60 * 1000)); // 1 hour slot

    const conflictingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate: {
            $gte: appointmentStart,
            $lt: appointmentEnd
        },
        status: 'scheduled'
    });

    return !conflictingAppointment;
};