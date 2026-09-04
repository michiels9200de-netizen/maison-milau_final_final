import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../dist/server.cjs';

export default app;

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
