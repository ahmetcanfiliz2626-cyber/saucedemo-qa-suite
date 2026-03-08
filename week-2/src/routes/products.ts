import { Router, Request, Response } from 'express';
import { products } from '../data/products';

const router = Router();

router.get('/products', (_req: Request, res: Response) => {
  return res.status(200).json({ products });
});

export default router;
