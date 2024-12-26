import { Router } from 'express';

const appointmentRouter = Router();

// This is the route for booking an appointment
appointmentRouter.post('/book', (req, res) => {  
    res.send('Booked');
})


// This is the route for viewing all appointments
appointmentRouter.get('/history', (req, res) => {
    res.send('Viewed');
})


// This is the route for viewing upcoming appointments
appointmentRouter.get('/upcoming', (req, res) => {
    res.send('Viewed');
})


// This is the route for viewing a specific appointment
appointmentRouter.get('/view', (req, res) => {
    res.send('Viewed');
})


// This is the route for cancelling an appointment
appointmentRouter.post('/cancel', (req, res) => {
    res.send('Cancelled');
})

export default appointmentRouter;