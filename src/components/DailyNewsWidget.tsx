import { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, ChevronRight, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  link?: string;
}

export function DailyNewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/daily-news');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNews(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have cached news for today
    const cached = localStorage.getItem('icu_daily_news_v2');
    const cachedDate = localStorage.getItem('icu_daily_news_date_v2');
    const today = new Date().toDateString();

    if (cached && cachedDate === today) {
      try {
        setNews(JSON.parse(cached));
        setLoading(false);
        return;
      } catch (e) {
        // ignore parse error
      }
    }

    fetchNews();
  }, []);

  // Save to cache when news updates successfully
  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('icu_daily_news_v2', JSON.stringify(news));
      localStorage.setItem('icu_daily_news_date_v2', new Date().toDateString());
    }
  }, [news]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="ios-section" style={{ padding: 0 }}>
          <span className="label flex items-center gap-1.5 font-bold text-indigo-500">
            <Newspaper className="w-4 h-4" />
            Berita Medis Terkini (IGD & ICU)
          </span>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="text-xs text-muted-foreground bg-muted/60 hover:bg-muted p-1.5 rounded-full transition-colors"
          title="Refresh Berita"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden">
        {loading && news.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-indigo-500/50 animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">Menyusun ringkasan terbaru dengan Gemini AI...</p>
          </div>
        ) : error && news.length === 0 ? (
          <div className="p-5 text-center bg-red-50/50 dark:bg-red-900/10">
            <p className="text-[12px] text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button 
              onClick={fetchNews}
              className="mt-2 text-[11px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--separator)]">
            {news.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-muted/20 transition-colors group">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-[13px] text-foreground leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
                        {item.source}
                      </span>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Baca / Download</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="bg-muted/30 p-2 text-center border-t border-border/40">
          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            Powered by Gemini with Google Search
          </p>
        </div>
      </div>
    </div>
  );
}
