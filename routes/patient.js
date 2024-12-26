import { Router } from "express";

const patientRouter = Router();

// This is the route to get the patient's profile
patientRouter.get('/profile/:id', (req, res) => {
    res.send('Viewed');
})

// This is the route to update the patient's profile
patientRouter.put('/profile/:id', (req, res) => {
    res.send('Updated');
})


export default patientRouter;

