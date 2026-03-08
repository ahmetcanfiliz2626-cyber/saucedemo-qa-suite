import express from 'express';
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import checkoutRouter from './routes/checkout';

const app = express();

app.use(express.json());

app.use('/api', authRouter);
app.use('/api', productsRouter);
app.use('/api', checkoutRouter);

export default app;
