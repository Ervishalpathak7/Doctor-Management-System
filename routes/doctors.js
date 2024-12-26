import { Router } from 'express';

const doctorRouter = Router();

doctorRouter.get('/list', (req, res) => {
    res.send('Viewed');
})

doctorRouter.get('/details/:id', (req, res) => {
    res.send('Viewed');
})

doctorRouter.post('/update/:id', (req, res) => {
    res.send('Updated');
})

export default doctorRouter;