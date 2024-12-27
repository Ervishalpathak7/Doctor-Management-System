import Patient from '../schema/patient.js'; 
import Wallet from '../schema/wallet.js';


// Create a new patient
export const createPatient = async (req, res) => {
    try { 
        // Create a new patient with hashed password
        const newPatient = new Patient({
            ...req.body, 
            password: await hashPassword(req.body.password)
        });

        await newPatient.save();
    
        const newWallet = await getPatientWallet(newPatient._id);

        res.status(201).json({ patient: newPatient, wallet: newWallet });
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient or wallet', error });
    }
};

// Login a patient
export const loginPatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({ email: req.body.email });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        if (!comparePassword(req.body.password, patient.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const wallet = await getPatientWallet(patient._id);
        res.status(200).json({ patient, wallet });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in patient', error });
    }
};


// Get all patients
export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
};

// Get a single patient by ID
export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient', error });
    }
};

// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error });
    }
};

// Delete a patient
export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        await Wallet.findOneAndDelete({ patientId: req.params.id });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error });
    }
};

// Get patient wallet
export const getPatientWallet = async (patientId) => {
    let wallet = await Wallet.findOne({ patientId });
    if (!wallet) {
        wallet = new Wallet({ patientId, balance: 0 });
        await wallet.save();
    }
    return wallet;
};
