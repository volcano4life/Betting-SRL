interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Cache to store fetched news for 10 minutes
const newsCache = new Map<string, { data: GNewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function fetchGNews(category: string = 'sports', country: string = 'it'): Promise<GNewsArticle[]> {
  if (!process.env.GNEWS_API_KEY) {
    throw new Error('GNEWS_API_KEY environment variable is required');
  }

  const cacheKey = `${category}_${country}`;
  const cached = newsCache.get(cacheKey);
  
  // Return cached data if still valid
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&apikey=${process.env.GNEWS_API_KEY}&max=20&lang=it`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
    }

    const data: GNewsResponse = await response.json();
    
    // Cache the results
    newsCache.set(cacheKey, {
      data: data.articles,
      timestamp: Date.now()
    });

    return data.articles;
  } catch (error) {
    console.error('Error fetching GNews:', error);
    throw error;
  }
}

export function convertGNewsToNews(article: GNewsArticle, index: number): any {
  // Create a slug from title
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();

  // Determine category based on keywords in title/description
  let category = 'Sports';
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  if (text.includes('serie a') || text.includes('juventus') || text.includes('milan') || text.includes('inter') || text.includes('napoli') || text.includes('roma') || text.includes('calcio')) {
    category = 'Football';
  } else if (text.includes('champions') || text.includes('uefa')) {
    category = 'Champions League';
  } else if (text.includes('tennis')) {
    category = 'Tennis';
  }

  return {
    id: index + 1000, // Offset to avoid conflicts with sample data
    title_en: article.title,
    title_it: article.title, // GNews already returns Italian content
    slug: slug,
    summary_en: article.description || article.content?.substring(0, 200) + '...' || '',
    summary_it: article.description || article.content?.substring(0, 200) + '...' || '',
    content_en: article.content || article.description || '',
    content_it: article.content || article.description || '',
    coverImage: article.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80',
    category: category,
    featured: index < 3 ? 1 : 0, // Mark first 3 as featured
    publishDate: new Date(article.publishedAt),
    sourceUrl: article.url,
    sourceName: article.source.name
  };
}