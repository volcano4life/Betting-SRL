import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Game, News, Review, Guide, User, Outlet, AdvertisementBanner } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Save, Trash, UserPlus, ShieldAlert, ShieldCheck, Lock, Crown, Clock, AlertTriangle, Users, Store, MapPin, Plus, X, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { getPageTitle, siteConfig } from "@/config/siteConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DragDropImageGallery } from "@/components/ui/drag-drop-image-gallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";

type ContentType = "games" | "reviews" | "news" | "guides" | "administrators" | "outlets" | "banners";

export default function AdminPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ContentType>("games");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Reset editing state when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as ContentType);
    setEditingItemId(null);
    setIsAdding(false);
  };

  // Handle starting edit mode
  const handleEdit = (id: number) => {
    setEditingItemId(id);
    setIsAdding(false);
  };

  // Handle starting add mode
  const handleAdd = () => {
    setEditingItemId(null);
    setIsAdding(true);
  };

  // Handle canceling edit/add mode
  const handleCancel = () => {
    setEditingItemId(null);
    setIsAdding(false);
  };

  // Handle successful edit/add operation
  const handleSuccess = () => {
    setEditingItemId(null);
    setIsAdding(false);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              {t('admin.accessDenied')}
            </CardTitle>
            <CardDescription>
              {t('admin.adminRequired')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                {t('admin.contactAdmin')}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">{t('admin.backToHome')}</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="flex-1"
                >
                  {t('admin.logout')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle('admin.title')}</title>
        <meta name="description" content={t('admin.description')} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('admin.title')}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Crown className="h-4 w-4" />
                  {user.username}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={language === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </Button>
                  <Button
                    variant={language === 'it' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLanguage('it')}
                  >
                    IT
                  </Button>
                </div>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">{t('admin.viewSite')}</Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('admin.logout')
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="games" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {t('admin.games')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                {t('admin.reviews')}
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('admin.news')}
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('admin.guides')}
              </TabsTrigger>
              <TabsTrigger value="outlets" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                {t('admin.outlets')}
              </TabsTrigger>
              <TabsTrigger value="banners" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="administrators" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('admin.administrators')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games" className="space-y-6">
              {editingItemId || isAdding ? (
                <GameForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.games')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('admin.addGame')}
                    </Button>
                  </div>
                  <GamesList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              {editingItemId || isAdding ? (
                <ReviewForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.reviews')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('admin.addReview')}
                    </Button>
                  </div>
                  <ReviewsList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              {editingItemId || isAdding ? (
                <NewsForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.news')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('admin.addNews')}
                    </Button>
                  </div>
                  <NewsList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              {editingItemId || isAdding ? (
                <GuideForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.guides')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('admin.addGuide')}
                    </Button>
                  </div>
                  <GuidesList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="outlets" className="space-y-6">
              {editingItemId || isAdding ? (
                <OutletForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.outlets')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t('admin.addOutlet')}
                    </Button>
                  </div>
                  <OutletsList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="banners" className="space-y-6">
              {editingItemId || isAdding ? (
                <BannerForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Advertisement Banners</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Banner
                    </Button>
                  </div>
                  <BannersList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="administrators" className="space-y-6">
              {isAdding ? (
                <AdminInviteForm 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : editingItemId ? (
                <AdminEditForm 
                  id={editingItemId} 
                  onCancel={handleCancel} 
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t('admin.administrators')}</h2>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      {t('admin.inviteAdmin')}
                    </Button>
                  </div>
                  <AdminsList onEdit={handleEdit} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

type FormProps = {
  id: number | null;
  onCancel: () => void;
  onSuccess: () => void;
};

// ===== GAMES =====
function GamesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/admin/games'],
    meta: {
      errorMessage: t('admin.gameLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/games/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/games'] });
      toast({
        title: t('admin.gameDeletedTitle'),
        description: t('admin.gameDeletedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.gameDeleteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.games')}</CardTitle>
        <CardDescription>{t('admin.gamesDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.rating')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games?.length ? (
                games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{getLocalizedField(game, 'title')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {game.overallRating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {game.featured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(game.id)}
                      >
                        {t('admin.edit')}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4 mr-1" />
                            {t('admin.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.confirmDeleteTitle')}</DialogTitle>
                            <DialogDescription>
                              {t('admin.confirmDeleteGame')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(game.id);
                                document.querySelector('dialog')?.close();
                              }}
                            >
                              {t('admin.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {t('admin.noGames')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function GameForm({ id, onCancel, onSuccess }: FormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Game>>({
    title_en: '',
    title_it: '',
    description_en: '',
    description_it: '',
    slug: '',
    overallRating: 0,
    featured: 0,
    releaseDate: new Date(),
    coverImage: '',
    platforms: [],
    genres: [],
    gameplayRating: 0,
    graphicsRating: 0,
    storyRating: 0,
    valueRating: 0
  });
  
  const { data: game, isLoading, isError } = useQuery<Game>({
    queryKey: [`/api/admin/games/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.gameLoadError')
    },
    retry: false
  });
  
  // Initialize form with game data when loaded (editing mode)
  React.useEffect(() => {
    if (game) {
      setFormData({
        ...game,
        releaseDate: new Date(game.releaseDate)
      });
    }
  }, [game]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Game>) => {
      // Ensure the date is properly formatted
      const dataToSend = {
        ...data,
        releaseDate: data.releaseDate instanceof Date 
          ? data.releaseDate 
          : new Date(data.releaseDate as string)
      };
      
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/games/${id}`, dataToSend);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/games', dataToSend);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/games'] });
      toast({
        title: id ? t('admin.gameUpdatedTitle') : t('admin.gameCreatedTitle'),
        description: id ? t('admin.gameUpdatedDesc') : t('admin.gameCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.savingErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'featured' || name.includes('Rating')
          ? parseFloat(value) || 0
          : name === 'releaseDate' && value
            ? new Date(value)
            : name === 'slug' && prev.title_en && !value
              ? generateSlug(prev.title_en as string)
              : value
    }));
  };

  // Generate slug when title changes
  React.useEffect(() => {
    if (formData.title_en && (!formData.slug || !id)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title_en as string)
      }));
    }
  }, [formData.title_en, id]);

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id ? t('admin.editGame') : t('admin.addGame')}
        </CardTitle>
        <CardDescription>
          {t('admin.gameFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_en">{t('admin.title')} (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={formData.title_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_en">{t('admin.description')} (EN)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en || ''}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_it">{t('admin.title')} (IT)</Label>
                <Input
                  id="title_it"
                  name="title_it"
                  value={formData.title_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_it">{t('admin.description')} (IT)</Label>
                <Textarea
                  id="description_it"
                  name="description_it"
                  value={formData.description_it || ''}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.slug')}</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseDate">{t('admin.releaseDate')}</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate instanceof Date ? formData.releaseDate.toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">{t('admin.featured')}</Label>
                <Select 
                  name="featured" 
                  value={formData.featured?.toString() || "0"}
                  onValueChange={(value) => handleChange({
                    target: { name: 'featured', value, type: 'select' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectFeatured')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('admin.notFeatured')}</SelectItem>
                    <SelectItem value="1">{t('admin.featured')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">{t('admin.coverImage')}</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platforms">{t('admin.platforms')}</Label>
                <Input
                  id="platforms"
                  name="platforms"
                  value={formData.platforms?.join(', ') || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    platforms: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                  }))}
                  placeholder="PC, PlayStation, Xbox"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genres">{t('admin.genres')}</Label>
                <Input
                  id="genres"
                  name="genres"
                  value={formData.genres?.join(', ') || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                  }))}
                  placeholder="Action, Adventure, RPG"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overallRating">{t('admin.overallRating')}</Label>
                <Input
                  id="overallRating"
                  name="overallRating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.overallRating || 0}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gameplayRating">{t('admin.gameplayRating')}</Label>
                <Input
                  id="gameplayRating"
                  name="gameplayRating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.gameplayRating || 0}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="graphicsRating">{t('admin.graphicsRating')}</Label>
                <Input
                  id="graphicsRating"
                  name="graphicsRating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.graphicsRating || 0}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storyRating">{t('admin.storyRating')}</Label>
                <Input
                  id="storyRating"
                  name="storyRating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.storyRating || 0}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valueRating">{t('admin.valueRating')}</Label>
                <Input
                  id="valueRating"
                  name="valueRating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.valueRating || 0}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ===== REVIEWS =====
function ReviewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/admin/reviews'],
    meta: {
      errorMessage: t('admin.reviewLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: t('admin.reviewDeletedTitle'),
        description: t('admin.reviewDeletedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.reviewDeleteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.reviews')}</CardTitle>
        <CardDescription>{t('admin.reviewsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.publishDate')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.length ? (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{getLocalizedField(review, 'title')}</TableCell>
                    <TableCell>{format(new Date(review.publishDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      {review.featured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(review.id)}
                      >
                        {t('admin.edit')}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4 mr-1" />
                            {t('admin.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.confirmDeleteTitle')}</DialogTitle>
                            <DialogDescription>
                              {t('admin.confirmDeleteReview')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(review.id);
                                document.querySelector('dialog')?.close();
                              }}
                            >
                              {t('admin.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {t('admin.noReviews')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ReviewForm({ id, onCancel, onSuccess }: FormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Review>>({
    title_en: '',
    title_it: '',
    content_en: '',
    content_it: '',
    excerpt_en: '',
    excerpt_it: '',
    slug: '',
    featured: 0,
    publishDate: new Date(),
    featuredImage: '',
    tags: []
  });
  
  const { data: review, isLoading, isError } = useQuery<Review>({
    queryKey: [`/api/admin/reviews/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.reviewLoadError')
    },
    retry: false
  });
  
  // Initialize form with review data when loaded (editing mode)
  React.useEffect(() => {
    if (review) {
      setFormData({
        ...review,
        publishDate: new Date(review.publishDate)
      });
    }
  }, [review]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Review>) => {
      // Ensure the date is properly formatted
      const dataToSend = {
        ...data,
        publishDate: data.publishDate instanceof Date 
          ? data.publishDate 
          : new Date(data.publishDate as string)
      };
      
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/reviews/${id}`, dataToSend);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/reviews', dataToSend);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: id ? t('admin.reviewUpdatedTitle') : t('admin.reviewCreatedTitle'),
        description: id ? t('admin.reviewUpdatedDesc') : t('admin.reviewCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.savingErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'featured'
          ? parseInt(value) || 0
          : name === 'publishDate' && value
            ? new Date(value)
            : name === 'slug' && prev.title_en && !value
              ? generateSlug(prev.title_en as string)
              : value
    }));
  };

  // Generate slug when title changes
  React.useEffect(() => {
    if (formData.title_en && (!formData.slug || !id)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title_en as string)
      }));
    }
  }, [formData.title_en, id]);

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id ? t('admin.editReview') : t('admin.addReview')}
        </CardTitle>
        <CardDescription>
          {t('admin.reviewFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_en">{t('admin.title')} (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={formData.title_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_en">{t('admin.excerpt')} (EN)</Label>
                <Textarea
                  id="excerpt_en"
                  name="excerpt_en"
                  value={formData.excerpt_en || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_en">{t('admin.content')} (EN)</Label>
                <Textarea
                  id="content_en"
                  name="content_en"
                  value={formData.content_en || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_it">{t('admin.title')} (IT)</Label>
                <Input
                  id="title_it"
                  name="title_it"
                  value={formData.title_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_it">{t('admin.excerpt')} (IT)</Label>
                <Textarea
                  id="excerpt_it"
                  name="excerpt_it"
                  value={formData.excerpt_it || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_it">{t('admin.content')} (IT)</Label>
                <Textarea
                  id="content_it"
                  name="content_it"
                  value={formData.content_it || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.slug')}</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishDate">{t('admin.publishDate')}</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate instanceof Date ? formData.publishDate.toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured">{t('admin.featured')}</Label>
                <Select 
                  name="featured" 
                  value={formData.featured?.toString() || "0"}
                  onValueChange={(value) => handleChange({
                    target: { name: 'featured', value, type: 'select' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectFeatured')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('admin.notFeatured')}</SelectItem>
                    <SelectItem value="1">{t('admin.featured')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredImage">{t('admin.featuredImage')}</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">{t('admin.tags')}</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }))}
                placeholder="casino, review, bonus"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ===== NEWS =====
function NewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/admin/news'],
    meta: {
      errorMessage: t('admin.newsLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      toast({
        title: t('admin.newsDeletedTitle'),
        description: t('admin.newsDeletedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.newsDeleteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.news')}</CardTitle>
        <CardDescription>{t('admin.newsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.publishDate')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news?.length ? (
                news.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>{getLocalizedField(newsItem, 'title')}</TableCell>
                    <TableCell>{format(new Date(newsItem.publishDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(newsItem.id)}
                      >
                        {t('admin.edit')}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4 mr-1" />
                            {t('admin.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.confirmDeleteTitle')}</DialogTitle>
                            <DialogDescription>
                              {t('admin.confirmDeleteNews')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(newsItem.id);
                                document.querySelector('dialog')?.close();
                              }}
                            >
                              {t('admin.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    {t('admin.noNews')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function NewsForm({ id, onCancel, onSuccess }: FormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<News>>({
    title_en: '',
    title_it: '',
    content_en: '',
    content_it: '',
    excerpt_en: '',
    excerpt_it: '',
    slug: '',
    publishDate: new Date(),
    featuredImage: '',
    tags: []
  });
  
  const { data: news, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/admin/news/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.newsLoadError')
    },
    retry: false
  });
  
  // Initialize form with news data when loaded (editing mode)
  React.useEffect(() => {
    if (news) {
      setFormData({
        ...news,
        publishDate: new Date(news.publishDate)
      });
    }
  }, [news]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<News>) => {
      // Ensure the date is properly formatted
      const dataToSend = {
        ...data,
        publishDate: data.publishDate instanceof Date 
          ? data.publishDate 
          : new Date(data.publishDate as string)
      };
      
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/news/${id}`, dataToSend);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/news', dataToSend);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/news'] });
      toast({
        title: id ? t('admin.newsUpdatedTitle') : t('admin.newsCreatedTitle'),
        description: id ? t('admin.newsUpdatedDesc') : t('admin.newsCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.savingErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'publishDate' && value
          ? new Date(value)
          : name === 'slug' && prev.title_en && !value
            ? generateSlug(prev.title_en as string)
            : value
    }));
  };

  // Generate slug when title changes
  React.useEffect(() => {
    if (formData.title_en && (!formData.slug || !id)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title_en as string)
      }));
    }
  }, [formData.title_en, id]);

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id ? t('admin.editNews') : t('admin.addNews')}
        </CardTitle>
        <CardDescription>
          {t('admin.newsFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_en">{t('admin.title')} (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={formData.title_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_en">{t('admin.excerpt')} (EN)</Label>
                <Textarea
                  id="excerpt_en"
                  name="excerpt_en"
                  value={formData.excerpt_en || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_en">{t('admin.content')} (EN)</Label>
                <Textarea
                  id="content_en"
                  name="content_en"
                  value={formData.content_en || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_it">{t('admin.title')} (IT)</Label>
                <Input
                  id="title_it"
                  name="title_it"
                  value={formData.title_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_it">{t('admin.excerpt')} (IT)</Label>
                <Textarea
                  id="excerpt_it"
                  name="excerpt_it"
                  value={formData.excerpt_it || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_it">{t('admin.content')} (IT)</Label>
                <Textarea
                  id="content_it"
                  name="content_it"
                  value={formData.content_it || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.slug')}</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishDate">{t('admin.publishDate')}</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate instanceof Date ? formData.publishDate.toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredImage">{t('admin.featuredImage')}</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">{t('admin.tags')}</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }))}
                placeholder="casino, news, bonus"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );  
}

// ===== GUIDES =====
function GuidesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ['/api/admin/guides'],
    meta: {
      errorMessage: t('admin.guideLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/guides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guides'] });
      toast({
        title: t('admin.guideDeletedTitle'),
        description: t('admin.guideDeletedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.guideDeleteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.guides')}</CardTitle>
        <CardDescription>{t('admin.guidesDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.publishDate')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides?.length ? (
                guides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell>{getLocalizedField(guide, 'title')}</TableCell>
                    <TableCell>{format(new Date(guide.publishDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(guide.id)}
                      >
                        {t('admin.edit')}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4 mr-1" />
                            {t('admin.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.confirmDeleteTitle')}</DialogTitle>
                            <DialogDescription>
                              {t('admin.confirmDeleteGuide')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(guide.id);
                                document.querySelector('dialog')?.close();
                              }}
                            >
                              {t('admin.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    {t('admin.noGuides')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function GuideForm({ id, onCancel, onSuccess }: FormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Guide>>({
    title_en: '',
    title_it: '',
    content_en: '',
    content_it: '',
    excerpt_en: '',
    excerpt_it: '',
    slug: '',
    publishDate: new Date(),
    featuredImage: '',
    tags: []
  });
  
  const { data: guide, isLoading, isError } = useQuery<Guide>({
    queryKey: [`/api/admin/guides/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.guideLoadError')
    },
    retry: false
  });
  
  // Initialize form with guide data when loaded (editing mode)
  React.useEffect(() => {
    if (guide) {
      setFormData({
        ...guide,
        publishDate: new Date(guide.publishDate)
      });
    }
  }, [guide]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Guide>) => {
      // Ensure the date is properly formatted
      const dataToSend = {
        ...data,
        publishDate: data.publishDate instanceof Date 
          ? data.publishDate 
          : new Date(data.publishDate as string)
      };
      
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/guides/${id}`, dataToSend);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/guides', dataToSend);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/guides'] });
      toast({
        title: id ? t('admin.guideUpdatedTitle') : t('admin.guideCreatedTitle'),
        description: id ? t('admin.guideUpdatedDesc') : t('admin.guideCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.savingErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'publishDate' && value
          ? new Date(value)
          : name === 'slug' && prev.title_en && !value
            ? generateSlug(prev.title_en as string)
            : value
    }));
  };

  // Generate slug when title changes
  React.useEffect(() => {
    if (formData.title_en && (!formData.slug || !id)) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title_en as string)
      }));
    }
  }, [formData.title_en, id]);

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id ? t('admin.editGuide') : t('admin.addGuide')}
        </CardTitle>
        <CardDescription>
          {t('admin.guideFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_en">{t('admin.title')} (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  value={formData.title_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_en">{t('admin.excerpt')} (EN)</Label>
                <Textarea
                  id="excerpt_en"
                  name="excerpt_en"
                  value={formData.excerpt_en || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_en">{t('admin.content')} (EN)</Label>
                <Textarea
                  id="content_en"
                  name="content_en"
                  value={formData.content_en || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title_it">{t('admin.title')} (IT)</Label>
                <Input
                  id="title_it"
                  name="title_it"
                  value={formData.title_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt_it">{t('admin.excerpt')} (IT)</Label>
                <Textarea
                  id="excerpt_it"
                  name="excerpt_it"
                  value={formData.excerpt_it || ''}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_it">{t('admin.content')} (IT)</Label>
                <Textarea
                  id="content_it"
                  name="content_it"
                  value={formData.content_it || ''}
                  onChange={handleChange}
                  required
                  rows={8}
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">{t('admin.slug')}</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishDate">{t('admin.publishDate')}</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate instanceof Date ? formData.publishDate.toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredImage">{t('admin.featuredImage')}</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">{t('admin.tags')}</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }))}
                placeholder="casino, guide, tutorial"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ===== OUTLETS =====
function OutletsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: outlets, isLoading } = useQuery<Outlet[]>({
    queryKey: ['/api/admin/outlets'],
    meta: {
      errorMessage: t('admin.outletLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/outlets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outlets'] });
      toast({
        title: t('admin.outletDeletedTitle'),
        description: t('admin.outletDeletedDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.outletDeleteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.outlets')}</CardTitle>
        <CardDescription>{t('admin.outletsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.name')}</TableHead>
                <TableHead>{t('admin.active')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlets?.length ? (
                outlets.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell>{getLocalizedField(outlet, 'name')}</TableCell>
                    <TableCell>
                      {outlet.active ? (
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {outlet.featured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(outlet.id)}
                      >
                        {t('admin.edit')}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4 mr-1" />
                            {t('admin.delete')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('admin.confirmDeleteTitle')}</DialogTitle>
                            <DialogDescription>
                              {t('admin.confirmDeleteOutlet')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(outlet.id);
                                document.querySelector('dialog')?.close();
                              }}
                            >
                              {t('admin.confirmDelete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {t('admin.noOutlets')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

type OutletFormProps = {
  id: number | null;
  onCancel: () => void;
  onSuccess: () => void;
};

function OutletForm({ id, onCancel, onSuccess }: OutletFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Outlet>>({
    name_en: '',
    name_it: '',
    description_en: '',
    description_it: '',
    logo: '',
    affiliateLink: '',
    featured: false,
    active: true
  });
  
  const { data: outlet, isLoading, isError } = useQuery<Outlet>({
    queryKey: [`/api/admin/outlets/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.outletLoadError')
    },
    retry: false
  });
  
  // Initialize form with outlet data when loaded (editing mode)
  React.useEffect(() => {
    if (outlet) {
      setFormData(outlet);
    }
  }, [outlet]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Outlet>) => {
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/outlets/${id}`, data);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/outlets', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outlets'] });
      toast({
        title: id ? t('admin.outletUpdatedTitle') : t('admin.outletCreatedTitle'),
        description: id ? t('admin.outletUpdatedDesc') : t('admin.outletCreatedDesc'),
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.savingErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id ? t('admin.editOutlet') : t('admin.addOutlet')}
        </CardTitle>
        <CardDescription>
          {t('admin.outletFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name_en">{t('admin.name')} (EN)</Label>
                <Input
                  id="name_en"
                  name="name_en"
                  value={formData.name_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_en">{t('admin.description')} (EN)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en || ''}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name_it">{t('admin.name')} (IT)</Label>
                <Input
                  id="name_it"
                  name="name_it"
                  value={formData.name_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_it">{t('admin.description')} (IT)</Label>
                <Textarea
                  id="description_it"
                  name="description_it"
                  value={formData.description_it || ''}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="logo">{t('admin.logo')}</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="affiliateLink">{t('admin.affiliateLink')}</Label>
              <Input
                id="affiliateLink"
                name="affiliateLink"
                value={formData.affiliateLink || ''}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  name="active"
                  checked={formData.active || false}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, active: checked as boolean }))
                  }
                />
                <Label htmlFor="active">{t('admin.active')}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  name="featured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, featured: checked as boolean }))
                  }
                />
                <Label htmlFor="featured">{t('admin.featured')}</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ===== ADMINISTRATORS =====
function AdminsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    meta: {
      errorMessage: t('admin.userLoadError')
    }
  });
  
  const blockMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: number; isBlocked: boolean }) => {
      await apiRequest('PATCH', `/api/admin/users/${id}/block`, { isBlocked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userStatusUpdatedTitle'),
        description: t('admin.userStatusUpdatedDesc'),
      });
    },
    onError: (error: unknown) => {
      toast({
        title: t('admin.userStatusUpdateErrorTitle'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const admins = users?.filter(user => user.isAdmin) || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.administrators')}</CardTitle>
        <CardDescription>{t('admin.administratorsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.username')}</TableHead>
                <TableHead>{t('admin.email')}</TableHead>
                <TableHead>{t('admin.role')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length ? (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        {admin.role || t('admin.administrator')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {admin.isBlocked ? (
                          <>
                            <Lock className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">{t('admin.blocked')}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">{t('admin.active')}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {currentUser?.id !== admin.id && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onEdit(admin.id)}
                          >
                            {t('admin.edit')}
                          </Button>
                          <Button
                            size="sm"
                            variant={admin.isBlocked ? "default" : "destructive"}
                            onClick={() => blockMutation.mutate({ id: admin.id, isBlocked: !admin.isBlocked })}
                            disabled={blockMutation.isPending}
                          >
                            {blockMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : admin.isBlocked ? (
                              <>
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                {t('admin.unblock')}
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-1" />
                                {t('admin.block')}
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    {t('admin.noAdministrators')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

type AdminFormProps = {
  id?: number;
  onCancel: () => void;
  onSuccess: () => void;
};

function AdminInviteForm({ onCancel, onSuccess }: AdminFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  
  const inviteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest('POST', '/api/admin/users/invite', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.adminInvitedTitle'),
        description: t('admin.adminInvitedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.inviteErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {t('admin.inviteAdmin')}
        </CardTitle>
        <CardDescription>
          {t('admin.inviteAdminDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('admin.username')}</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('admin.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('admin.password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">{t('admin.role')}</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder={t('admin.administrator')}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={inviteMutation.isPending}
              className="flex items-center gap-2"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {t('admin.invite')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AdminEditForm({ id, onCancel, onSuccess }: AdminFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    role: ''
  });
  
  const { data: admin, isLoading, isError } = useQuery<User>({
    queryKey: [`/api/admin/users/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.userLoadError')
    },
    retry: false
  });
  
  // Initialize form with admin data when loaded
  React.useEffect(() => {
    if (admin) {
      setFormData({
        role: admin.role || ''
      });
    }
  }, [admin]);
  
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest('PUT', `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.adminUpdatedTitle'),
        description: t('admin.adminUpdatedDesc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('admin.updateErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading spinner when loading data
  if (isLoading && id) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Handle errors (like 404 Not Found)
  if (isError && id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.error')}</CardTitle>
          <CardDescription>{t('admin.itemNotFound')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>{t('admin.itemNotFoundDesc')}</p>
            <Button variant="outline" className="mt-4" onClick={onCancel}>
              {t('admin.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          {t('admin.editAdmin')}
        </CardTitle>
        <CardDescription>
          {admin && t('admin.editingAdmin', { username: admin.username })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('admin.username')}</Label>
            <Input
              value={admin?.username || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('admin.email')}</Label>
            <Input
              value={admin?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">{t('admin.role')}</Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder={t('admin.administrator')}
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Advertisement Banner Components
function BannersList({ onEdit }: { onEdit: (id: number) => void }) {
  const { toast } = useToast();
  
  const { data: banners = [], isLoading } = useQuery<AdvertisementBanner[]>({
    queryKey: ['/api/admin/advertisement-banners'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/advertisement-banners/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisement-banners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/advertisement-banners'] });
      toast({
        title: "Success",
        description: "Advertisement banner deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete advertisement banner",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell className="capitalize">{banner.position}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    banner.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{banner.order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(banner.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(banner.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function BannerForm({ 
  id, 
  onCancel, 
  onSuccess 
}: { 
  id: number | null; 
  onCancel: () => void; 
  onSuccess: () => void; 
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    clickUrl: '',
    position: 'left' as 'left' | 'right',
    isActive: true,
    order: 1
  });

  const { data: banner } = useQuery<AdvertisementBanner>({
    queryKey: ['/api/admin/advertisement-banners', id],
    enabled: !!id,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        imageUrl: banner.imageUrl,
        clickUrl: banner.clickUrl || '',
        position: banner.position as 'left' | 'right',
        isActive: banner.isActive,
        order: banner.order
      });
    }
  }, [banner]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = id ? `/api/admin/advertisement-banners/${id}` : '/api/admin/advertisement-banners';
      const method = id ? 'PUT' : 'POST';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/advertisement-banners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/advertisement-banners'] });
      toast({
        title: "Success",
        description: `Advertisement banner ${id ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${id ? 'update' : 'create'} advertisement banner`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Edit' : 'Add'} Advertisement Banner</CardTitle>
        <CardDescription>
          {id ? 'Update' : 'Create'} advertisement banner settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Banner title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleChange('position', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/banner-image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clickUrl">Click URL (Optional)</Label>
            <Input
              id="clickUrl"
              value={formData.clickUrl}
              onChange={(e) => handleChange('clickUrl', e.target.value)}
              placeholder="https://example.com/landing-page"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          {formData.imageUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="w-32 h-32 border border-gray-200 rounded">
                <img 
                  src={formData.imageUrl} 
                  alt="Banner preview"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="flex items-center gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {id ? 'Update' : 'Create'} Banner
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
