import { fetchDailyNews, getFallback } from './_lib/dailyNews';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isRefresh = req.query.refresh === 'true';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json(getFallback(isRefresh));
  }

  const data = await fetchDailyNews(apiKey, isRefresh);
  return res.status(200).json(data);
}
