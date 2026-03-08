import { Router, Request, Response } from 'express';

const router = Router();

router.post('/checkout', (req: Request, res: Response) => {
  const { firstName, lastName, zipCode } = req.body as {
    firstName?: string;
    lastName?: string;
    zipCode?: string;
  };

  const missing: string[] = [];
  if (!firstName?.trim()) missing.push('firstName');
  if (!lastName?.trim()) missing.push('lastName');
  if (!zipCode?.trim()) missing.push('zipCode');

  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', fields: missing });
  }

  return res.status(201).json({ message: 'Checkout successful' });
});

export default router;
