import { Router } from "express";
import { createPatient, deletePatient, getPatientById , updatePatient , loginPatient , getPatientWallet } from "../controllers/patient.js";

const patientRouter = Router();


// This is the route to register a new patient
patientRouter.post('/register', createPatient);

// this is the roue to login a patient
patientRouter.post('/login', loginPatient);

// This is the route to get the patient's profile
patientRouter.get('/profile/:id',getPatientById);

// This is the route to update the patient's profile
patientRouter.put('/profile/:id' , updatePatient);

// this is the route to delete the patient's profile
patientRouter.delete('/profile/:id' , deletePatient);

// get the wallet of a patient
patientRouter.get('/wallet/:id',getPatientWallet);


export default patientRouter;

