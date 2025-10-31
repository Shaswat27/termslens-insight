import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    NODE_OPTIONS: process.env.NODE_OPTIONS ?? null,
    NODE_PATH: process.env.NODE_PATH ?? null,
    execArgv: process.execArgv
  });
}