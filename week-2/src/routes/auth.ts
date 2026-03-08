import { Router, Request, Response } from 'express';

const router = Router();

const USERS: Record<string, { password: string; locked: boolean }> = {
  standard_user: { password: 'secret_sauce', locked: false },
  locked_out_user: { password: 'secret_sauce', locked: true },
  problem_user: { password: 'secret_sauce', locked: false },
  performance_glitch_user: { password: 'secret_sauce', locked: false },
};

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  const user = username ? USERS[username] : undefined;

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Username and password do not match any user.' });
  }

  if (user.locked) {
    return res.status(403).json({ error: 'Sorry, this user has been locked out.' });
  }

  return res.status(200).json({ message: 'Login successful', username });
});

export default router;
