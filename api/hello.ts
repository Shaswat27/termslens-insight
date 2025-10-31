// api/hello.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log("API route /api/hello was hit!"); // Add a log
  res.status(200).json({ message: 'Hello from API!' });
}