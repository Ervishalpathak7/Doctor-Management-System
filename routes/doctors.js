import { Router } from 'express';
import { getDoctorById, getDoctors , updateDoctor, deleteDoctor , createDoctor , loginDoctor } from '../controllers/doctor.js';

const doctorRouter = Router();

// This is the route to get all doctors
doctorRouter.get('/list', getDoctors)

// This is the route to get a doctor by ID
doctorRouter.get('/details/:id', getDoctorById)

// This is the route to update a doctor
doctorRouter.put('/update/:id', updateDoctor)

// This is the route to delete a doctor
doctorRouter.delete('/delete/:id', deleteDoctor)

// This is the route to register a doctor
doctorRouter.post('/register', createDoctor)

// This is the route to login a doctor
doctorRouter.post('/login', loginDoctor)


export default doctorRouter;