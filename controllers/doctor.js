// controllers/doctorController.js
import Doctor from '../schema/doctor.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';


// register a new doctor
export const createDoctor = async (req, res) => {
    try {
        // Create a new doctor with hashed password
        const doctor = new Doctor({
            ...req.body,
            password: await hashPassword(req.body.password)
        });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error registering doctor', error });
    }
};


// Get all doctors
export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }

};

// Get a single doctor by ID
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error });
    }
};

// Update a doctor
export const updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor', error });
    }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error });
    }
};

// Login a doctor
export const loginDoctor = async (req, res) => {
    try {

        // Find a doctor with the email 
        const doctor = await
            Doctor.findOne ({ email: req.body.email});
        // If the doctor is not found
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // compare the password
        if (!comparePassword(req.body.password, doctor.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // If the doctor is found and the password is correct
        res.status(200).json(doctor);
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in doctor', error });
    }
}
