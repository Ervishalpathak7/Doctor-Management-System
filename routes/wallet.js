import { Router } from 'express';

const walletRouter = Router();

// This is the route for viewing the wallet balance
walletRouter.get('/balance', (req, res) => {
    res.send('Viewed');
})

// This is the route for adding money to the wallet
walletRouter.post('/add', (req, res) => {
    res.send('Added');
})

// This is the route for deducting money from the wallet
walletRouter.post('/deduct', (req, res) => {
    res.send('deducted');
})

export default walletRouter;