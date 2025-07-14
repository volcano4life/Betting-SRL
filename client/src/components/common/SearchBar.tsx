import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  onSearchClose?: () => void;
}

export default function SearchBar({ onSearchClose }: SearchBarProps) {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onSearchClose?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center">
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
  );
}