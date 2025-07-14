import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Game, Review, News, Guide } from '@shared/schema';
import { Link } from 'wouter';

interface SearchResults {
  games: Game[];
  reviews: Review[];
  news: News[];
  guides: Guide[];
}

export default function SearchPage() {
  const [location, navigate] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(location.split("?")[1] || ""));
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { getLocalizedField, t } = useLanguage();
  
  const { data: results, isLoading, error } = useQuery<SearchResults>({
    queryKey: ['/api/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { games: [], reviews: [], news: [], guides: [] };
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalResults = results 
    ? results.games.length + results.reviews.length + results.news.length + results.guides.length
    : 0;

  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-6">{t('search.title')}</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={!searchQuery.trim()}>
              {t('search.button')}
            </Button>
          </form>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('search.loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{t('search.error')}</p>
          </div>
        )}

        {results && !isLoading && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {totalResults > 0 
                  ? `${totalResults} ${t('search.resultsFound')} "${searchQuery}"`
                  : `${t('search.noResults')} "${searchQuery}"`
                }
              </p>
            </div>

            {totalResults > 0 && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 max-w-md mx-auto mb-8">
                  <TabsTrigger value="all">{t('search.all')} ({totalResults})</TabsTrigger>
                  <TabsTrigger value="games">{t('search.games')} ({results.games.length})</TabsTrigger>
                  <TabsTrigger value="reviews">{t('search.reviews')} ({results.reviews.length})</TabsTrigger>
                  <TabsTrigger value="news">{t('search.news')} ({results.news.length})</TabsTrigger>
                  <TabsTrigger value="guides">{t('search.guides')} ({results.guides.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8">
                  {results.games.length > 0 && (
                    <SearchSection title={t('search.games')} items={results.games} type="games" />
                  )}
                  {results.reviews.length > 0 && (
                    <SearchSection title={t('search.reviews')} items={results.reviews} type="reviews" />
                  )}
                  {results.news.length > 0 && (
                    <SearchSection title={t('search.news')} items={results.news} type="news" />
                  )}
                  {results.guides.length > 0 && (
                    <SearchSection title={t('search.guides')} items={results.guides} type="guides" />
                  )}
                </TabsContent>

                <TabsContent value="games">
                  <SearchSection title={t('search.games')} items={results.games} type="games" />
                </TabsContent>

                <TabsContent value="reviews">
                  <SearchSection title={t('search.reviews')} items={results.reviews} type="reviews" />
                </TabsContent>

                <TabsContent value="news">
                  <SearchSection title={t('search.news')} items={results.news} type="news" />
                </TabsContent>

                <TabsContent value="guides">
                  <SearchSection title={t('search.guides')} items={results.guides} type="guides" />
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchSection({ title, items, type }: { title: string; items: any[]; type: string }) {
  const { getLocalizedField } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No {type} found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SearchResultCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}

function SearchResultCard({ item, type }: { item: any; type: string }) {
  const { getLocalizedField, t } = useLanguage();
  
  const getTrackingLink = (title: string) => {
    switch (title) {
      case "Sisal":
        return "https://ads.sisal.it/promoRedirect?key=ej0xMzUyNDE2MyZsPTE2MTY4NTcxJnA9MTM2Nzc5";
      case "PokerStars":
        return "https://secure.starsaffiliateclub.com/C.ashx?btag=a_189389b_7227c_&affid=100980558&siteid=189389&adid=7227&c=";
      case "GoldBet":
        return "https://media.goldbetpartners.it/redirect.aspx?pid=16281&bid=1494";
      case "Lottomatica":
        return "https://media.lottomaticapartners.it/redirect.aspx?pid=16289&bid=1508";
      case "Betfair":
        return "https://promotions.betfair.it/prs/it-betfair-exchange-benvenuto-50?utm_medium=Partnerships&utm_source=18070&utm_campaign=127033&utm_content=4660412&utm_ad=369307";
      case "Netwin":
        return "https://www.netwin.it/signup?codAffiliato=BETTING";
      case "Eurobet":
        return "https://record.betpartners.it/_KrrQopPxr-1KqXDxdQZqW2Nd7ZgqdRLk/1/";
      case "Snai":
        return "https://informatoriads.snai.it/redirect.aspx?pid=40122&bid=1953";
      default:
        return null;
    }
  };
  
  const getItemLink = () => {
    switch (type) {
      case 'games':
        return `/games/${item.slug}`;
      case 'reviews':
        return `/reviews/${item.slug}`;
      case 'news':
        return `/news/${item.slug}`;
      case 'guides':
        return `/guides/${item.slug}`;
      default:
        return '#';
    }
  };

  const getItemBadge = () => {
    switch (type) {
      case 'games':
        return <Badge variant="secondary">Game</Badge>;
      case 'reviews':
        return <Badge variant="secondary">Review</Badge>;
      case 'news':
        return <Badge variant="secondary">News</Badge>;
      case 'guides':
        return <Badge variant="secondary">Guide</Badge>;
      default:
        return null;
    }
  };

  const title = getLocalizedField(item, 'title');
  const trackingLink = type === 'games' ? getTrackingLink(title) : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">
            {trackingLink ? (
              <a href={trackingLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {title}
              </a>
            ) : (
              <Link href={getItemLink()} className="hover:text-primary">
                {title}
              </Link>
            )}
          </CardTitle>
          {getItemBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {getLocalizedField(item, 'summary') || getLocalizedField(item, 'description')}
        </p>
        {item.rating && (
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <span>★</span>
            <span>{item.rating}/5</span>
          </div>
        )}
        {item.publishDate && (
          <div className="text-xs text-gray-500 mt-2">
            {new Date(item.publishDate).toLocaleDateString()}
          </div>
        )}
        {trackingLink && (
          <div className="mt-3">
            <a
              href={trackingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('featured.visitCasino')}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}