import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsContent as TabPanel, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PromoCode, Game, News, Review, Guide, User } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Save, Trash, UserPlus, ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import { Link } from "wouter";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";

type ContentType = "promo-codes" | "games" | "reviews" | "news" | "guides" | "administrators";

export default function AdminPage() {
  const { t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ContentType>("promo-codes");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Reset editing state when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as ContentType);
    setEditingItemId(null);
    setIsAdding(false);
  };
  
  // Check if current user is site owner (username: 'admin')
  const isSiteOwner = user?.username === 'admin';

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{t('admin.title')}</h1>
            <span className="text-sm px-2 py-1 rounded-md bg-primary/10 text-primary">
              {user?.username}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">{t('admin.backToSite')}</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              {t('admin.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Admin content */}
      <main className="container p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="promo-codes">{t('admin.promoCodes')}</TabsTrigger>
              <TabsTrigger value="games">{t('admin.games')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('admin.reviews')}</TabsTrigger>
              <TabsTrigger value="news">{t('admin.news')}</TabsTrigger>
              <TabsTrigger value="guides">{t('admin.guides')}</TabsTrigger>
              <TabsTrigger value="administrators">{t('admin.administrators')}</TabsTrigger>
            </TabsList>
            {activeTab !== 'administrators' ? (
              <Button onClick={() => {
                setIsAdding(true);
                setEditingItemId(null);
              }}>
                {t('admin.addNew')}
              </Button>
            ) : isSiteOwner && (
              <Button onClick={() => {
                setIsAdding(true);
                setEditingItemId(null);
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('admin.inviteAdmin')}
              </Button>
            )}
          </div>

          {/* Promo Codes Management */}
          <TabPanel value="promo-codes">
            {isAdding ? (
              <PromoCodeForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <PromoCodeForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <PromoCodesList onEdit={setEditingItemId} />
            )}
          </TabPanel>
          
          {/* Games Management */}
          <TabPanel value="games">
            {isAdding ? (
              <GameForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <GameForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <GamesList onEdit={setEditingItemId} />
            )}
          </TabPanel>
          
          {/* Reviews Management */}
          <TabPanel value="reviews">
            {isAdding ? (
              <ReviewForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <ReviewForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <ReviewsList onEdit={setEditingItemId} />
            )}
          </TabPanel>
          
          {/* News Management */}
          <TabPanel value="news">
            {isAdding ? (
              <NewsForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <NewsForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <NewsList onEdit={setEditingItemId} />
            )}
          </TabPanel>
          
          {/* Guides Management */}
          <TabPanel value="guides">
            {isAdding ? (
              <GuideForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <GuideForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <GuidesList onEdit={setEditingItemId} />
            )}
          </TabPanel>
          
          {/* Administrators Management */}
          <TabPanel value="administrators">
            {isAdding ? (
              <AdminInviteForm 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <AdminEditForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <AdminsList onEdit={setEditingItemId} />
            )}
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}

// ===== PROMO CODES =====
function PromoCodesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: promoCodes, isLoading } = useQuery<PromoCode[]>({
    queryKey: ['/api/admin/promo-codes'],
    meta: {
      errorMessage: t('admin.promoCodeLoadError')
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/promo-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promo-codes'] });
      toast({
        title: t('admin.promoCodeDeletedTitle'),
        description: t('admin.promoCodeDeletedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.promoCodeDeleteErrorTitle'),
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
        <CardTitle>{t('admin.promoCodes')}</CardTitle>
        <CardDescription>{t('admin.promoCodesDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.promoCodeCasino')}</TableHead>
                <TableHead>{t('admin.promoCode')}</TableHead>
                <TableHead>{t('admin.validUntil')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes?.length ? (
                promoCodes.map((promoCode) => (
                  <TableRow key={promoCode.id}>
                    <TableCell>{promoCode.casino_name_en}</TableCell>
                    <TableCell>{promoCode.code}</TableCell>
                    <TableCell>{format(new Date(promoCode.validUntil), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(promoCode.id)}
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
                              {t('admin.confirmDeletePromoCode')}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => document.querySelector('dialog')?.close()}>
                              {t('admin.cancel')}
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => {
                                deleteMutation.mutate(promoCode.id);
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
                    {t('admin.noPromoCodes')}
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

type PromoCodeFormProps = {
  id: number | null;
  onCancel: () => void;
  onSuccess: () => void;
};

function PromoCodeForm({ id, onCancel, onSuccess }: PromoCodeFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<PromoCode> & { validUntil: string | Date }>({
    casino_name_en: '',
    casino_name_it: '',
    code: '',
    description_en: '',
    description_it: '',
    bonus_en: '',
    bonus_it: '',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    casinoLogo: '',
    affiliateLink: '',
    active: true,
    featured: 0
  });

  const { data: promoCode, isLoading, isError } = useQuery<PromoCode>({
    queryKey: [`/api/admin/promo-codes/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.promoCodeLoadError')
    },
    retry: false
  });

  // Initialize form with promoCode data when loaded (editing mode)
  React.useEffect(() => {
    if (promoCode) {
      setFormData({
        ...promoCode,
        validUntil: new Date(promoCode.validUntil).toISOString().split('T')[0]
      });
    }
  }, [promoCode]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PromoCode>) => {
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/promo-codes/${id}`, data);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/promo-codes', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promo-codes'] });
      toast({
        title: id ? t('admin.promoCodeUpdatedTitle') : t('admin.promoCodeCreatedTitle'),
        description: id ? t('admin.promoCodeUpdatedDesc') : t('admin.promoCodeCreatedDesc'),
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
          ? parseInt(value) 
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
          {id ? t('admin.editPromoCode') : t('admin.addPromoCode')}
        </CardTitle>
        <CardDescription>
          {t('admin.promoCodeFormDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.englishContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="casino_name_en">{t('admin.casinoName')} (EN)</Label>
                <Input
                  id="casino_name_en"
                  name="casino_name_en"
                  value={formData.casino_name_en || ''}
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
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus_en">{t('admin.bonus')} (EN)</Label>
                <Input
                  id="bonus_en"
                  name="bonus_en"
                  value={formData.bonus_en || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Italian Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('admin.italianContent')}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="casino_name_it">{t('admin.casinoName')} (IT)</Label>
                <Input
                  id="casino_name_it"
                  name="casino_name_it"
                  value={formData.casino_name_it || ''}
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
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus_it">{t('admin.bonus')} (IT)</Label>
                <Input
                  id="bonus_it"
                  name="bonus_it"
                  value={formData.bonus_it || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('admin.commonFields')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('admin.promoCode')}</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validUntil">{t('admin.validUntil')}</Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil || ''}
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
                    <SelectItem value="1">{t('admin.featuredLevel1')}</SelectItem>
                    <SelectItem value="2">{t('admin.featuredLevel2')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="casinoLogo">{t('admin.logoUrl')}</Label>
              <Input
                id="casinoLogo"
                name="casinoLogo"
                value={formData.casinoLogo || ''}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="affiliateLink">{t('admin.affiliateLink')}</Label>
              <Input
                id="affiliateLink"
                name="affiliateLink"
                value={formData.affiliateLink || ''}
                onChange={handleChange}
                required
                placeholder="https://example.com/affiliate"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ===== GAMES =====
// For brevity, I'm adding stubs for the remaining components,
// which would follow the same pattern as the PromoCode components above

function GamesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ['/api/admin/games'],
    meta: {
      errorMessage: t('admin.gamesLoadError')
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
                <TableHead>{t('admin.slug')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games?.length ? (
                games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      {game.title_en} / {game.title_it}
                    </TableCell>
                    <TableCell>{game.slug}</TableCell>
                    <TableCell>{game.featured ? '✓' : '–'}</TableCell>
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
                                // Add deletion logic here when implemented
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

function GameForm({ id, onCancel, onSuccess }: PromoCodeFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: game, isLoading, isError } = useQuery<Game>({
    queryKey: [`/api/admin/games/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.gameLoadError')
    },
    retry: false
  });
  
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
        <div className="text-center py-8">
          <p>{t('admin.implementationPending')}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            {t('admin.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== REVIEWS =====
function ReviewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/admin/reviews'],
    meta: {
      errorMessage: t('admin.reviewsLoadError')
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
                <TableHead>{t('admin.gameId')}</TableHead>
                <TableHead>{t('admin.rating')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.length ? (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.title_en} / {review.title_it}
                    </TableCell>
                    <TableCell>{review.gameId}</TableCell>
                    <TableCell>{review.rating}/10</TableCell>
                    <TableCell>{review.featured ? '✓' : '–'}</TableCell>
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
                                // Add deletion logic here when implemented
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
                  <TableCell colSpan={5} className="text-center py-6">
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

function ReviewForm({ id, onCancel, onSuccess }: PromoCodeFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: review, isLoading, isError } = useQuery<Review>({
    queryKey: [`/api/admin/reviews/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.reviewLoadError')
    },
    retry: false
  });
  
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
        <div className="text-center py-8">
          <p>{t('admin.implementationPending')}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            {t('admin.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== NEWS =====
function NewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/admin/news'],
    meta: {
      errorMessage: t('admin.newsLoadError')
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
                <TableHead>{t('admin.category')}</TableHead>
                <TableHead>{t('admin.publishDate')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news?.length ? (
                news.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>
                      {newsItem.title_en} / {newsItem.title_it}
                    </TableCell>
                    <TableCell>{newsItem.category}</TableCell>
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
                                // Add deletion logic here when implemented
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

function NewsForm({ id, onCancel, onSuccess }: PromoCodeFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: newsItem, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/admin/news/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.newsLoadError')
    },
    retry: false
  });
  
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
        <div className="text-center py-8">
          <p>{t('admin.implementationPending')}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            {t('admin.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== GUIDES =====
function GuidesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  
  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: ['/api/admin/guides'],
    meta: {
      errorMessage: t('admin.guidesLoadError')
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
                <TableHead>{t('admin.difficulty')}</TableHead>
                <TableHead>{t('admin.publishDate')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides?.length ? (
                guides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell>
                      {guide.title_en} / {guide.title_it}
                    </TableCell>
                    <TableCell>{guide.difficulty}</TableCell>
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
                                // Add deletion logic here when implemented
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

function GuideForm({ id, onCancel, onSuccess }: PromoCodeFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { data: guide, isLoading, isError } = useQuery<Guide>({
    queryKey: [`/api/admin/guides/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.guideLoadError')
    },
    retry: false
  });
  
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
        <div className="text-center py-8">
          <p>{t('admin.implementationPending')}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            {t('admin.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ===== ADMINISTRATORS =====
function AdminsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if current user is site owner (username: 'admin')
  const isSiteOwner = user?.username === 'admin';
  
  const { data: admins, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    meta: {
      errorMessage: t('admin.usersLoadError')
    }
  });
  
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: number; isBlocked: boolean }) => {
      await apiRequest('PUT', `/api/admin/users/${id}/status`, { isBlocked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userStatusUpdatedTitle'),
        description: t('admin.userStatusUpdatedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.userStatusErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const approveAdminMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/admin/users/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.adminApprovedTitle'),
        description: t('admin.adminApprovedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.adminApproveErrorTitle'),
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
        <CardTitle>{t('admin.administrators')}</CardTitle>
        <CardDescription>{t('admin.administratorsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.username')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead>{t('admin.createdAt')}</TableHead>
                <TableHead>{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins?.length ? (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {admin.username}
                        {admin.username === 'admin' && (
                          <span className="ml-2 text-xs font-normal px-2 py-1 rounded-md bg-primary/20 text-primary">
                            {t('admin.siteOwner')}
                          </span>
                        )}
                        {!admin.isAdmin && (
                          <span className="ml-2 text-xs font-normal px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            {t('admin.pendingApproval')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.isBlocked ? (
                        <span className="inline-flex items-center text-destructive">
                          <Lock className="h-4 w-4 mr-1" />
                          {t('admin.blocked')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-green-600">
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          {t('admin.active')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(admin.createdAt), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {/* Don't show action buttons for site owner or for current user */}
                      {admin.username !== 'admin' && admin.id !== user?.id && (
                        <>
                          {!admin.isAdmin && isSiteOwner && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => approveAdminMutation.mutate(admin.id)}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              {t('admin.approve')}
                            </Button>
                          )}
                          
                          {admin.isAdmin && isSiteOwner && (
                            <Button 
                              size="sm" 
                              variant={admin.isBlocked ? 'outline' : 'destructive'}
                              onClick={() => toggleBlockMutation.mutate({ 
                                id: admin.id, 
                                isBlocked: !admin.isBlocked 
                              })}
                            >
                              {admin.isBlocked ? (
                                <>
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  {t('admin.unblock')}
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  {t('admin.block')}
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
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
    password: '',
    isAdmin: true
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
        title: t('admin.adminInviteErrorTitle'),
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.inviteAdmin')}</CardTitle>
        <CardDescription>{t('admin.inviteAdminDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              <Label htmlFor="password">{t('admin.initialPassword')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground">
                {t('admin.passwordRequirements')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {t('admin.sendInvite')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AdminEditForm({ id, onCancel, onSuccess }: AdminFormProps) {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.editAdmin')}</CardTitle>
        <CardDescription>{t('admin.editAdminDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p>{t('admin.implementationPending')}</p>
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            {t('admin.back')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}