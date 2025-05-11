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
import { PromoCode, Game, News, Review, Guide, User, Outlet } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Save, Trash, UserPlus, ShieldAlert, ShieldCheck, Lock, Crown, Clock, AlertTriangle, Users, Store, MapPin } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";

type ContentType = "promo-codes" | "games" | "reviews" | "news" | "guides" | "administrators" | "outlets";

export default function AdminPage() {
  const { t, language, setLanguage } = useLanguage();
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
  
  // Handle language toggle
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  return (
    <>
      <Helmet>
        <title translate="no">{getPageTitle('admin')}</title>
        <meta name="description" content={`Administrator control panel for managing content on ${siteConfig.name}.`} />
      </Helmet>
      
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
            <Button variant="outline" onClick={toggleLanguage}>
              {language === 'en' ? '🇮🇹 Italiano' : '🇬🇧 English'}
            </Button>
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
            <div className="flex items-center">
              <TabsList className="mr-4">
                <TabsTrigger value="promo-codes">{t('admin.promoCodes')}</TabsTrigger>
                <TabsTrigger value="games">{t('admin.games')}</TabsTrigger>
                <TabsTrigger value="reviews">{t('admin.reviews')}</TabsTrigger>
                <TabsTrigger value="news">{t('admin.news')}</TabsTrigger>
                <TabsTrigger value="guides">{t('admin.guides')}</TabsTrigger>
                <TabsTrigger value="outlets">
                  <Store className="h-4 w-4 mr-2" />
                  {language === 'it' ? 'Punti Vendita' : 'Outlets'}
                </TabsTrigger>
              </TabsList>
              
              <Separator orientation="vertical" className="h-8 mx-2" />
              
              <TabsList>
                <TabsTrigger value="administrators" className="bg-secondary/30">
                  <Users className="h-4 w-4 mr-2" />
                  {t('admin.administrators')}
                </TabsTrigger>
              </TabsList>
            </div>
            
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
          <TabsContent value="promo-codes">
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
          </TabsContent>
          
          {/* Games Management */}
          <TabsContent value="games">
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
          </TabsContent>
          
          {/* Reviews Management */}
          <TabsContent value="reviews">
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
          </TabsContent>
          
          {/* News Management */}
          <TabsContent value="news">
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
          </TabsContent>
          
          {/* Guides Management */}
          <TabsContent value="guides">
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
          </TabsContent>
          
          {/* Administrators Management */}
          <TabsContent value="administrators">
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
          </TabsContent>

          {/* Outlets Management */}
          <TabsContent value="outlets">
            {isAdding ? (
              <OutletForm 
                id={null} 
                onCancel={() => setIsAdding(false)} 
                onSuccess={() => setIsAdding(false)} 
              />
            ) : editingItemId ? (
              <OutletForm 
                id={editingItemId} 
                onCancel={() => setEditingItemId(null)} 
                onSuccess={() => setEditingItemId(null)} 
              />
            ) : (
              <OutletsList onEdit={setEditingItemId} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </>
  );
}

// ===== PROMO CODES =====
function PromoCodesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
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
                    <TableCell>{getLocalizedField(promoCode, 'casino_name')}</TableCell>
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
        validUntil: new Date(promoCode.validUntil)
      });
    }
  }, [promoCode]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<PromoCode> & { validUntil: string | Date }) => {
      // Convert validUntil to Date object for API submission
      const dataToSend = {
        ...data,
        validUntil: data.validUntil instanceof Date 
          ? data.validUntil 
          : new Date(data.validUntil)
      };
      
      if (id) {
        // Update existing
        await apiRequest('PUT', `/api/admin/promo-codes/${id}`, dataToSend);
      } else {
        // Create new
        await apiRequest('POST', '/api/admin/promo-codes', dataToSend);
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
    
    // Convert the Date object to an ISO string for API submission
    const dataToSubmit = {
      ...formData,
      validUntil: formData.validUntil instanceof Date 
        ? formData.validUntil.toISOString() 
        : formData.validUntil
    };
    
    saveMutation.mutate(dataToSubmit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'featured' 
          ? parseInt(value) 
          : name === 'validUntil' && value
            ? new Date(value)
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
                  value={formData.validUntil instanceof Date ? formData.validUntil.toISOString().split('T')[0] : String(formData.validUntil || '')}
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
  const { t, getLocalizedField } = useLanguage();
  
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
                <TableHead>{t('admin.titleColumn')}</TableHead>
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
                      {getLocalizedField(game, 'title')}
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
    
    // Make sure slug is filled
    if (!formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en || '')
      }));
    }
    
    saveMutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'rating'
          ? parseFloat(value)
          : name === 'releaseDate' && value
            ? new Date(value)
            : value
    }));
  };
  
  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title_en && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en)
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
                  rows={3}
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
                  rows={3}
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
                <Label htmlFor="overallRating">{t('admin.overallRating')}</Label>
                <Input
                  id="overallRating"
                  name="overallRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.overallRating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gameplayRating">{t('admin.gameplayRating')}</Label>
                <Input
                  id="gameplayRating"
                  name="gameplayRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.gameplayRating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graphicsRating">{t('admin.graphicsRating')}</Label>
                <Input
                  id="graphicsRating"
                  name="graphicsRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.graphicsRating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storyRating">{t('admin.storyRating')}</Label>
                <Input
                  id="storyRating"
                  name="storyRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.storyRating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valueRating">{t('admin.valueRating')}</Label>
                <Input
                  id="valueRating"
                  name="valueRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.valueRating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="releaseDate">{t('admin.releaseDate')}</Label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate instanceof Date 
                    ? formData.releaseDate.toISOString().split('T')[0] 
                    : String(formData.releaseDate || '')}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">{t('admin.coverImage')}</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured ? true : false}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    featured: checked ? 1 : 0
                  }))
                }}
              />
              <Label htmlFor="featured">{t('admin.featuredGame')}</Label>
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

// ===== REVIEWS =====
function ReviewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  
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
                <TableHead>{t('admin.titleColumn')}</TableHead>
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
                      {getLocalizedField(review, 'title')}
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
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Review>>({
    title_en: '',
    title_it: '',
    summary_en: '',
    summary_it: '',
    content_en: '',
    content_it: '',
    slug: '',
    rating: 0,
    featured: 0,
    gameId: 0,
    coverImage: ''
  });
  
  // Get games for game selection dropdown
  const { data: games } = useQuery<Game[]>({
    queryKey: ['/api/admin/games'],
    meta: {
      errorMessage: t('admin.gamesLoadError')
    }
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
    
    // Make sure slug is filled
    if (!formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en || '')
      }));
    }
    
    saveMutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'rating' || name === 'gameId'
        ? parseFloat(value)
        : value
    }));
  };
  
  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title_en && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en)
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
                <Label htmlFor="summary_en">{t('admin.summary')} (EN)</Label>
                <Textarea
                  id="summary_en"
                  name="summary_en"
                  value={formData.summary_en || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="summary_it">{t('admin.summary')} (IT)</Label>
                <Textarea
                  id="summary_it"
                  name="summary_it"
                  value={formData.summary_it || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="gameId">{t('admin.game')}</Label>
                <Select 
                  name="gameId" 
                  value={formData.gameId?.toString() || ""}
                  onValueChange={(value) => handleChange({
                    target: { name: 'gameId', value, type: 'number' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectGame')} />
                  </SelectTrigger>
                  <SelectContent>
                    {games?.map(game => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.title_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">{t('admin.rating')}</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating || 0}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">{t('admin.coverImage')}</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured ? true : false}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    featured: checked ? 1 : 0
                  }))
                }}
              />
              <Label htmlFor="featured">{t('admin.featuredReview')}</Label>
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

// ===== NEWS =====
function NewsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  
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
                <TableHead>{t('admin.titleColumn')}</TableHead>
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
                      {getLocalizedField(newsItem, 'title')}
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
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<News>>({
    title_en: '',
    title_it: '',
    summary_en: '',
    summary_it: '',
    content_en: '',
    content_it: '',
    slug: '',
    category: '',
    featured: 0,
    coverImage: ''
  });
  
  const { data: newsItem, isLoading, isError } = useQuery<News>({
    queryKey: [`/api/admin/news/${id}`],
    enabled: !!id,
    meta: {
      errorMessage: t('admin.newsLoadError')
    },
    retry: false
  });
  
  // Initialize form with news data when loaded (editing mode)
  React.useEffect(() => {
    if (newsItem) {
      setFormData({
        ...newsItem,
        publishDate: new Date(newsItem.publishDate)
      });
    }
  }, [newsItem]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<News>) => {
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
    
    // Make sure slug is filled
    if (!formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en || '')
      }));
    }
    
    saveMutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title_en && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en)
      }));
    }
  }, [formData.title_en, id]);
  
  // News categories
  const categories = [
    'casino-news',
    'sports-betting',
    'gambling-regulations',
    'promotions',
    'industry-news'
  ];
  
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
                <Label htmlFor="summary_en">{t('admin.summary')} (EN)</Label>
                <Textarea
                  id="summary_en"
                  name="summary_en"
                  value={formData.summary_en || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="summary_it">{t('admin.summary')} (IT)</Label>
                <Textarea
                  id="summary_it"
                  name="summary_it"
                  value={formData.summary_it || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="category">{t('admin.category')}</Label>
                <Select 
                  name="category" 
                  value={formData.category || ""}
                  onValueChange={(value) => handleChange({
                    target: { name: 'category', value, type: 'select' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(`admin.category.${category}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishDate">{t('admin.publishDate')}</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate instanceof Date 
                    ? formData.publishDate.toISOString().split('T')[0] 
                    : String(formData.publishDate || new Date().toISOString().split('T')[0])}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">{t('admin.coverImage')}</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured ? true : false}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    featured: checked ? 1 : 0
                  }))
                }}
              />
              <Label htmlFor="featured">{t('admin.featuredNews')}</Label>
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

// ===== GUIDES =====
function GuidesList({ onEdit }: { onEdit: (id: number) => void }) {
  const { t, getLocalizedField } = useLanguage();
  
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
                <TableHead>{t('admin.titleColumn')}</TableHead>
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
                      {getLocalizedField(guide, 'title')}
                    </TableCell>
                    <TableCell>{t(`admin.difficulty.${guide.difficulty.toLowerCase()}`)}</TableCell>
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
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Partial<Guide>>({
    title_en: '',
    title_it: '',
    summary_en: '',
    summary_it: '',
    content_en: '',
    content_it: '',
    slug: '',
    category: '',
    difficulty: 'BEGINNER',
    coverImage: ''
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
    
    // Make sure slug is filled
    if (!formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en || '')
      }));
    }
    
    saveMutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title_en && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title_en)
      }));
    }
  }, [formData.title_en, id]);
  
  // Guide categories
  const categories = [
    'betting-strategies',
    'casino-games',
    'sports-betting',
    'poker-guides',
    'responsible-gambling'
  ];
  
  // Guide difficulty levels
  const difficultyLevels = [
    'beginner',
    'intermediate',
    'advanced',
    'expert'
  ];
  
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
                <Label htmlFor="summary_en">{t('admin.summary')} (EN)</Label>
                <Textarea
                  id="summary_en"
                  name="summary_en"
                  value={formData.summary_en || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="summary_it">{t('admin.summary')} (IT)</Label>
                <Textarea
                  id="summary_it"
                  name="summary_it"
                  value={formData.summary_it || ''}
                  onChange={handleChange}
                  required
                  rows={2}
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
                  rows={6}
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
                <Label htmlFor="category">{t('admin.category')}</Label>
                <Select 
                  name="category" 
                  value={formData.category || ""}
                  onValueChange={(value) => handleChange({
                    target: { name: 'category', value, type: 'select' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(`admin.category.${category}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">{t('admin.difficulty')}</Label>
                <Select 
                  name="difficulty" 
                  value={formData.difficulty || "BEGINNER"}
                  onValueChange={(value) => handleChange({
                    target: { name: 'difficulty', value, type: 'select' }
                  } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectDifficulty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level} value={level.toUpperCase()}>
                        {t(`admin.difficulty.${level}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishDate">{t('admin.publishDate')}</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate instanceof Date 
                    ? formData.publishDate.toISOString().split('T')[0] 
                    : String(formData.publishDate || new Date().toISOString().split('T')[0])}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">{t('admin.coverImage')}</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>
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

// ===== OUTLETS =====
function OutletsList({ onEdit }: { onEdit: (id: number) => void }) {
  const { language, t, getLocalizedField } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: outlets, isLoading } = useQuery<Outlet[]>({
    queryKey: ['/api/admin/outlets'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/outlets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outlets'] });
      toast({
        title: language === 'it' ? 'Punto Vendita Eliminato' : 'Outlet Deleted',
        description: language === 'it' 
          ? 'Il punto vendita è stato eliminato con successo.'
          : 'The outlet has been successfully deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      await apiRequest('PUT', `/api/admin/outlets/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outlets'] });
      toast({
        title: language === 'it' ? 'Stato Aggiornato' : 'Status Updated',
        description: language === 'it' 
          ? 'Lo stato del punto vendita è stato aggiornato con successo.'
          : 'The outlet status has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'it' ? 'Gestione Punti Vendita' : 'Outlets Management'}</CardTitle>
        <CardDescription>
          {language === 'it' 
            ? 'Gestisci i punti vendita visualizzati sul sito.'
            : 'Manage the outlets displayed on the website.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'it' ? 'Nome' : 'Name'}</TableHead>
                <TableHead>{language === 'it' ? 'Indirizzo' : 'Address'}</TableHead>
                <TableHead>{language === 'it' ? 'Stato' : 'Status'}</TableHead>
                <TableHead>{language === 'it' ? 'Ordine' : 'Order'}</TableHead>
                <TableHead className="text-right">{language === 'it' ? 'Azioni' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlets && outlets.length > 0 ? (
                outlets
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((outlet) => (
                    <TableRow key={outlet.id}>
                      <TableCell className="font-medium">{getLocalizedField(outlet, 'title')}</TableCell>
                      <TableCell>{getLocalizedField(outlet, 'address') || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${outlet.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          {outlet.isActive 
                            ? (language === 'it' ? 'Attivo' : 'Active') 
                            : (language === 'it' ? 'Inattivo' : 'Inactive')}
                        </div>
                      </TableCell>
                      <TableCell>{outlet.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatusMutation.mutate({ id: outlet.id, isActive: !outlet.isActive })}
                          >
                            {outlet.isActive 
                              ? (language === 'it' ? 'Disattiva' : 'Deactivate') 
                              : (language === 'it' ? 'Attiva' : 'Activate')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(outlet.id)}
                          >
                            {language === 'it' ? 'Modifica' : 'Edit'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (window.confirm(language === 'it' 
                                ? 'Sei sicuro di voler eliminare questo punto vendita?' 
                                : 'Are you sure you want to delete this outlet?')) {
                                deleteMutation.mutate(outlet.id);
                              }
                            }}
                          >
                            {language === 'it' ? 'Elimina' : 'Delete'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {language === 'it' ? 'Nessun punto vendita trovato.' : 'No outlets found.'}
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
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [additionalImageInput, setAdditionalImageInput] = useState('');
  
  const [formData, setFormData] = useState({
    title_en: '',
    title_it: '',
    description_en: '',
    description_it: '',
    address_en: '',
    address_it: '',
    imageUrl: '',
    additionalImages: [],
    order: 0,
    isActive: true
  });
  
  // Fetch outlet data if editing
  const { isLoading } = useQuery<Outlet>({
    queryKey: [`/api/admin/outlets/${id}`],
    enabled: id !== null,
  });
  
  React.useEffect(() => {
    const fetchOutlet = async () => {
      if (id !== null) {
        try {
          const response = await apiRequest('GET', `/api/admin/outlets/${id}`);
          const data = await response.json();
          
          setFormData({
            title_en: data.title_en,
            title_it: data.title_it,
            description_en: data.description_en || '',
            description_it: data.description_it || '',
            address_en: data.address_en || '',
            address_it: data.address_it || '',
            imageUrl: data.imageUrl,
            additionalImages: data.additionalImages || [],
            order: data.order || 0,
            isActive: data.isActive
          });
        } catch (error) {
          console.error('Error fetching outlet:', error);
        }
      }
    };
    
    fetchOutlet();
  }, [id]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (id === null) {
        // Create new outlet
        await apiRequest('POST', '/api/admin/outlets', data);
      } else {
        // Update existing outlet
        await apiRequest('PUT', `/api/admin/outlets/${id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/outlets'] });
      toast({
        title: id === null
          ? (language === 'it' ? 'Punto Vendita Creato' : 'Outlet Created')
          : (language === 'it' ? 'Punto Vendita Aggiornato' : 'Outlet Updated'),
        description: id === null
          ? (language === 'it' ? 'Il punto vendita è stato creato con successo.' : 'The outlet has been successfully created.')
          : (language === 'it' ? 'Il punto vendita è stato aggiornato con successo.' : 'The outlet has been successfully updated.'),
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const addAdditionalImage = () => {
    if (!additionalImageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      additionalImages: [...prev.additionalImages, additionalImageInput.trim()]
    }));
    setAdditionalImageInput('');
  };
  
  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = [...prev.additionalImages];
      updatedImages.splice(index, 1);
      return {
        ...prev,
        additionalImages: updatedImages
      };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {id === null 
            ? (language === 'it' ? 'Aggiungi Punto Vendita' : 'Add Outlet')
            : (language === 'it' ? 'Modifica Punto Vendita' : 'Edit Outlet')}
        </CardTitle>
        <CardDescription>
          {id === null 
            ? (language === 'it' ? 'Inserisci i dettagli del nuovo punto vendita.' : 'Enter the details for the new outlet.')
            : (language === 'it' ? 'Modifica i dettagli del punto vendita esistente.' : 'Edit the details of the existing outlet.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Italian Title */}
            <div className="space-y-2">
              <Label htmlFor="title_it">
                {language === 'it' ? 'Nome (Italiano)' : 'Name (Italian)'}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title_it"
                name="title_it"
                value={formData.title_it}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* English Title */}
            <div className="space-y-2">
              <Label htmlFor="title_en">
                {language === 'it' ? 'Nome (Inglese)' : 'Name (English)'}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title_en"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* Italian Description */}
            <div className="space-y-2">
              <Label htmlFor="description_it">
                {language === 'it' ? 'Descrizione (Italiano)' : 'Description (Italian)'}
              </Label>
              <Textarea
                id="description_it"
                name="description_it"
                value={formData.description_it}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            {/* English Description */}
            <div className="space-y-2">
              <Label htmlFor="description_en">
                {language === 'it' ? 'Descrizione (Inglese)' : 'Description (English)'}
              </Label>
              <Textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            {/* Italian Address */}
            <div className="space-y-2">
              <Label htmlFor="address_it">
                {language === 'it' ? 'Indirizzo (Italiano)' : 'Address (Italian)'}
              </Label>
              <Input
                id="address_it"
                name="address_it"
                value={formData.address_it}
                onChange={handleChange}
              />
            </div>
            
            {/* English Address */}
            <div className="space-y-2">
              <Label htmlFor="address_en">
                {language === 'it' ? 'Indirizzo (Inglese)' : 'Address (English)'}
              </Label>
              <Input
                id="address_en"
                name="address_en"
                value={formData.address_en}
                onChange={handleChange}
              />
            </div>
            
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                {language === 'it' ? 'URL Immagine' : 'Image URL'}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                placeholder="redmoon1"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'it' 
                  ? 'Nome del file dell\'immagine (es. redmoon1, redmoon2, ecc.)'
                  : 'Image filename (e.g., redmoon1, redmoon2, etc.)'}
              </p>
            </div>
            
            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">
                {language === 'it' ? 'Ordine di Visualizzazione' : 'Display Order'}
              </Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={handleNumberChange}
              />
              <p className="text-xs text-muted-foreground">
                {language === 'it' 
                  ? 'I punti vendita vengono visualizzati in ordine crescente (0, 1, 2, ...)'
                  : 'Outlets are displayed in ascending order (0, 1, 2, ...)'}
              </p>
            </div>
          </div>
          
          {/* Additional Images */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>
                {language === 'it' ? 'Immagini Aggiuntive' : 'Additional Images'}
              </Label>
              <div className="flex space-x-2">
                <Input
                  placeholder={language === 'it' ? 'Nome del file immagine' : 'Image filename'}
                  value={additionalImageInput}
                  onChange={(e) => setAdditionalImageInput(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={addAdditionalImage}
                  disabled={!additionalImageInput}
                >
                  {language === 'it' ? 'Aggiungi' : 'Add'}
                </Button>
              </div>
            </div>
            
            {formData.additionalImages.length > 0 && (
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-2">
                  {language === 'it' ? 'Immagini Aggiunte:' : 'Added Images:'}
                </h4>
                <ul className="space-y-2">
                  {formData.additionalImages.map((img, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span>{img}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData((prev) => ({ ...prev, isActive: checked === true }))
              }
            />
            <Label htmlFor="isActive" className="font-normal">
              {language === 'it' ? 'Attivo' : 'Active'}
            </Label>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {language === 'it' ? 'Annulla' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {language === 'it' ? 'Salva' : 'Save'}
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Check if current user is site owner (username: 'admin')
  const isSiteOwner = user?.username === 'admin';
  
  // State for role selection dialog
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('superadmin');
  
  // State for ownership transfer
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState<number | null>(null);
  const [transferPendingUserId, setTransferPendingUserId] = useState<number | null>(null);
  const [transferDeadline, setTransferDeadline] = useState<Date | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Check for any pending transfers on component mount
  useEffect(() => {
    const storedTransfer = localStorage.getItem('ownershipTransfer');
    if (storedTransfer) {
      try {
        const { userId, deadline } = JSON.parse(storedTransfer);
        setTransferPendingUserId(userId);
        setTransferDeadline(new Date(deadline));
      } catch (e) {
        console.error('Error parsing stored transfer', e);
        localStorage.removeItem('ownershipTransfer');
      }
    }
  }, []);
  
  // Effect to check if transfer deadline has passed
  useEffect(() => {
    if (transferDeadline && transferPendingUserId) {
      const checkDeadline = () => {
        const now = new Date();
        if (now >= transferDeadline) {
          // Transfer is complete
          completeOwnershipTransfer();
        }
      };
      
      // Check now and set interval
      checkDeadline();
      const interval = setInterval(checkDeadline, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [transferDeadline, transferPendingUserId]);
  
  const { data: admins, isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    meta: {
      errorMessage: t('admin.usersLoadError')
    }
  });
  
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: number; isBlocked: boolean }) => {
      await apiRequest('PUT', `/api/admin/users/${id}/status`, { isBlocked });
      return { id, isBlocked };
    },
    onSuccess: (data) => {
      // Update the cached data directly to ensure the UI reflects the change
      const previousData = queryClient.getQueryData<User[]>(['/api/admin/users']);
      if (previousData) {
        const updatedData = previousData.map(user => 
          user.id === data.id ? { ...user, isBlocked: data.isBlocked } : user
        );
        queryClient.setQueryData(['/api/admin/users'], updatedData);
      } else {
        // If there's no cached data yet, invalidate to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      }
      
      toast({
        title: t('admin.statusUpdatedTitle'),
        description: t('admin.statusUpdatedDesc'),
      });
    },
    onError: (error) => {
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  const approveAdminMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      // In a real implementation, you would send the role to the backend
      await apiRequest('PUT', `/api/admin/users/${id}/approve`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.adminApprovedTitle'),
        description: t('admin.adminApprovedDesc'),
      });
      setIsRoleDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t('admin.adminApproveErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Handle opening the role selection dialog
  const handleApproveClick = (userId: number) => {
    setSelectedUserId(userId);
    setIsRoleDialogOpen(true);
  };
  
  // Handle role selection and admin approval
  const handleRoleConfirm = () => {
    if (selectedUserId) {
      approveAdminMutation.mutate({ id: selectedUserId, role: selectedRole });
    }
  };
  
  // Handle opening the transfer ownership dialog
  const handleTransferClick = (userId: number) => {
    setTransferTargetId(userId);
    setIsTransferDialogOpen(true);
  };
  
  // Initialize ownership transfer
  const initializeOwnershipTransfer = () => {
    if (transferTargetId) {
      // Set 24 hour deadline
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 24);
      
      // Save to state and localStorage
      setTransferPendingUserId(transferTargetId);
      setTransferDeadline(deadline);
      localStorage.setItem('ownershipTransfer', JSON.stringify({
        userId: transferTargetId,
        deadline: deadline.toISOString()
      }));
      
      setIsTransferDialogOpen(false);
      
      toast({
        title: t('admin.transferOwnershipPending'),
        description: t('admin.transferOwnershipTimer').replace('{hours}', '24').replace('{minutes}', '00'),
      });
    }
  };
  
  // Cancel ownership transfer
  const cancelOwnershipTransfer = () => {
    localStorage.removeItem('ownershipTransfer');
    setTransferPendingUserId(null);
    setTransferDeadline(null);
    
    toast({
      title: t('admin.transferCancelled'),
    });
  };
  
  // Complete ownership transfer (would need backend implementation)
  const completeOwnershipTransfer = () => {
    // In real implementation, make API call to transfer ownership
    localStorage.removeItem('ownershipTransfer');
    setTransferPendingUserId(null);
    setTransferDeadline(null);
    
    toast({
      title: t('admin.transferCompleted'),
    });
  };
  
  // Format remaining time for display
  const formatRemainingTime = () => {
    if (!transferDeadline) return '';
    
    const now = new Date();
    const diff = transferDeadline.getTime() - now.getTime();
    
    if (diff <= 0) return '';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return t('admin.transferOwnershipTimer')
      .replace('{hours}', hours.toString())
      .replace('{minutes}', minutes.toString());
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      {/* Ownership transfer banner (if transfer is in progress) */}
      {transferPendingUserId && transferDeadline && isSiteOwner && (
        <div 
          className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {t('admin.transferInProgress')}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {formatRemainingTime()}
              </p>
            </div>
          </div>
          
          {isHovering && (
            <Button 
              className="absolute right-2 top-2" 
              size="sm" 
              variant="destructive"
              onClick={cancelOwnershipTransfer}
            >
              {t('admin.cancelTransfer')}
            </Button>
          )}
        </div>
      )}
    
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.administrators')}</CardTitle>
          <CardDescription>{t('admin.administratorsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="w-full overflow-auto">
              <Table className="min-w-[650px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">{t('admin.administratorName')}</TableHead>
                    <TableHead className="w-[15%]">{t('admin.status')}</TableHead>
                    <TableHead className="w-[15%]">{t('admin.createdAt')}</TableHead>
                    <TableHead className="w-[45%]">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins?.length ? (
                    admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1">
                            <span>{admin.username}</span>
                            <div className="flex flex-wrap gap-1 mt-1 xs:mt-0">
                              {admin.username === 'admin' && (
                                <span className="text-xs font-normal px-2 py-1 rounded-md bg-primary/20 text-primary">
                                  {t('admin.siteOwner')}
                                </span>
                              )}
                              {admin.username === 'superadmin' && (
                                <span className="text-xs font-normal px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                                  {t('admin.superAdmin')}
                                </span>
                              )}
                              {!admin.isAdmin && (
                                <span className="text-xs font-normal px-2 py-1 rounded-md bg-muted text-muted-foreground">
                                  {t('admin.pendingApproval')}
                                </span>
                              )}
                              
                              {/* Show indicator if this is the user with pending ownership transfer */}
                              {transferPendingUserId === admin.id && (
                                <span className="text-xs font-normal px-2 py-1 rounded-md bg-amber-100 text-amber-700 animate-pulse">
                                  <Clock className="inline-block h-3 w-3 mr-1" />
                                  {t('admin.pendingTransfer')}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {admin.isBlocked ? (
                            <span className="inline-flex items-center text-destructive text-xs whitespace-nowrap">
                              <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                              {t('admin.blocked')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-green-600 text-xs whitespace-nowrap">
                              <ShieldCheck className="h-3 w-3 mr-1 flex-shrink-0" />
                              {t('admin.active')}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs">
                          {format(new Date(admin.createdAt), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {/* Don't show action buttons for site owner or for current user */}
                          {admin.username !== 'admin' && admin.id !== user?.id ? (
                            <div className="flex flex-wrap gap-2">
                              {!admin.isAdmin && isSiteOwner && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 text-xs px-2"
                                  onClick={() => handleApproveClick(admin.id)}
                                >
                                  <ShieldCheck className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{t('admin.approve')}</span>
                                </Button>
                              )}
                              
                              {admin.isAdmin && isSiteOwner && (
                                <>
                                  <Button 
                                    size="icon" 
                                    variant={admin.isBlocked ? 'outline' : 'destructive'}
                                    className="h-7 w-7"
                                    onClick={() => toggleBlockMutation.mutate({ 
                                      id: admin.id, 
                                      isBlocked: !admin.isBlocked 
                                    })}
                                    title={admin.isBlocked ? t('admin.unblock') : t('admin.block')}
                                  >
                                    {admin.isBlocked ? (
                                      <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                                    ) : (
                                      <Lock className="h-3 w-3 flex-shrink-0" />
                                    )}
                                    <span className="sr-only">
                                      {admin.isBlocked ? t('admin.unblock') : t('admin.block')}
                                    </span>
                                  </Button>
                                  
                                  {/* Transfer ownership button (only for active Super Admins) */}
                                  {isSiteOwner && 
                                   !admin.isBlocked && 
                                   admin.username === 'superadmin' && 
                                   !transferPendingUserId && (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                      onClick={() => handleTransferClick(admin.id)}
                                      title={t('admin.transferOwnership')}
                                    >
                                      <Crown className="h-3 w-3 flex-shrink-0" />
                                      <span className="sr-only">{t('admin.transferOwnership')}</span>
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
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
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Role Selection Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.selectRoleTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.selectRoleDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('admin.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t('admin.regularAdmin')}</SelectItem>
                <SelectItem value="superadmin">{t('admin.superAdmin')}</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {selectedRole === 'superadmin' 
                  ? t('admin.superAdminDescription')
                  : t('admin.regularAdminDescription')}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              {t('admin.cancel')}
            </Button>
            <Button onClick={handleRoleConfirm} disabled={approveAdminMutation.isPending}>
              {approveAdminMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('admin.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ownership Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.transferOwnershipTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.transferOwnershipDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mb-2" />
              <p className="text-sm font-medium text-yellow-800">
                {t('admin.transferWarningTitle')}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                {t('admin.transferWarningDesc')}
              </p>
            </div>
            
            <p className="text-sm font-medium">
              {t('admin.transferTimerExplanation')}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              {t('admin.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={initializeOwnershipTransfer}
            >
              <Crown className="mr-2 h-4 w-4" />
              {t('admin.initiateTransfer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
    email: '',
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
              <Label htmlFor="username">{t('admin.administratorName')}</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('admin.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder={t('admin.emailOptional')}
              />
              <p className="text-sm text-muted-foreground">
                {t('admin.emailDescription')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={inviteMutation.isPending}
            >
              {inviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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