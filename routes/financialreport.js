import { Router } from "express";

const financialreportRouter = Router();

// This is the route for viewing daily financial report
financialreportRouter.get('/daily', (req, res) => {
    res.send('Viewed');
})

// This is the route for viewing weekly financial report
financialreportRouter.get('/weekly', (req, res) => {
    res.send('Viewed');
})

// This is the route for viewing monthly financial report
financialreportRouter.get('/monthly', (req, res) => {
    res.send('Viewed');
})

export default financialreportRouter;