import { getDailyNews } from './_lib/dailyNews';
import { verifyIdToken, extractBearerToken } from './_lib/verifyToken';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const idToken = extractBearerToken(req.headers?.authorization);
  if (!(await verifyIdToken(idToken))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isRefresh = req.query.refresh === 'true';
  const data = await getDailyNews(process.env.GEMINI_API_KEY, isRefresh);
  return res.status(200).json(data);
}
