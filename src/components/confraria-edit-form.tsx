
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, Camera, BookOpen, Calendar, Info, Newspaper, Utensils, Pencil, Globe, Facebook, Instagram, X, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser, uploadImage } from '@/app/actions';
import { districts } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';

type ConfrariaProfile = {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  description?: string;
  region?: string; // Corresponds to district
  council?: string;
  foundationYear?: number | string;
  bannerURL?: string;
  lema?: string;
  fundadores?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  gallery?: { id: string; url: string; data_ai_hint: string }[];
};

type ConfrariaEditFormProps = {
  confraria: ConfrariaProfile;
};

export function ConfrariaEditForm({ confraria }: ConfrariaEditFormProps) {
  const [profile, setProfile] = useState<ConfrariaProfile>(confraria);
  const [councils, setCouncils] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<null | 'logo' | 'banner' | 'gallery'>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (profile.region) {
      const districtData = districts.find(d => d.name === profile.region);
      setCouncils(districtData?.councils || []);
    } else {
      setCouncils([]);
    }
  }, [profile.region]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSelectChange = (name: 'region' | 'council') => (value: string) => {
    if (!profile) return;
    
    if (name === 'region') {
      // Reset council when district changes
      setProfile({ ...profile, region: value, council: '' });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const dataToUpdate = {
        name: profile.name,
        description: profile.description,
        region: profile.region,
        council: profile.council,
        foundationYear: profile.foundationYear,
        photoURL: profile.photoURL,
        bannerURL: profile.bannerURL,
        lema: profile.lema,
        fundadores: profile.fundadores,
        website: profile.website,
        facebook: profile.facebook,
        instagram: profile.instagram,
        gallery: profile.gallery,
      };
      
      const result = await updateUser(profile.id, dataToUpdate as any);

      if (result.success) {
        toast({ title: 'Sucesso!', description: 'Perfil da confraria atualizado.' });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Erro', description: 'Não foi possível guardar as alterações.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (files: File[], type: 'logo' | 'banner' | 'gallery') => {
    if (!profile) return;

    setIsUploading(type);
    try {
        const uploadPromises = files.map(async (file) => {
            let options = {};
             if (type === 'logo') {
                options = { maxSizeMB: 0.5, maxWidthOrHeight: 400, useWebWorker: true, fileType: 'image/webp' };
            } else if (type === 'banner') {
                options = { maxSizeMB: 1.5, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' };
            } else { // gallery
                options = { maxSizeMB: 1.5, maxWidthOrHeight: 1280, useWebWorker: true, fileType: 'image/webp' };
            }

            const compressedFile = await imageCompression(file, options);
            const formData = new FormData();
            formData.append('file', compressedFile, compressedFile.name);
            const uploadResult = await uploadImage(formData);

            if (uploadResult.success && uploadResult.url) {
                return uploadResult.url;
            } else {
                throw new Error(uploadResult.error || `Falha no upload de ${file.name}.`);
            }
        });

        const urls = await Promise.all(uploadPromises);

        if (type === 'gallery') {
            const newImages = urls.map(url => ({ id: Date.now().toString() + Math.random(), url, data_ai_hint: 'food drink' }));
            setProfile(prev => ({
                ...prev,
                gallery: [...(prev.gallery || []), ...newImages]
            }));
        } else { // logo or banner
            const fieldToUpdate = type === 'logo' ? 'photoURL' : 'bannerURL';
            setProfile(prevProfile => ({ ...prevProfile, [fieldToUpdate]: urls[0] }));
        }

        toast({ title: 'Sucesso!', description: `${files.length} imagem(ns) carregada(s). Clique em "Guardar Alterações" para aplicar.` });
    } catch (error: any) {
        console.error(`Error uploading ${type}:`, error);
        toast({ title: 'Erro de Upload', description: error.message || 'Não foi possível carregar as imagens.', variant: 'destructive' });
    } finally {
        setIsUploading(null);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload([e.target.files[0]], type);
    }
  };


  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageUpload(Array.from(e.target.files), 'gallery');
    }
  };

  const removeGalleryImage = (id: string) => {
    setProfile(prev => ({
      ...prev,
      gallery: prev.gallery?.filter(img => img.id !== id),
    }));
  };
  
   const icons = {
    details: <Info />,
    images: <ImageIcon />,
    events: <Calendar />,
    publications: <Newspaper />,
    gallery: <Camera />,
    recipes: <Utensils />,
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 h-auto">
        <TabsTrigger value="details">
            {icons.details}
            <span className="ml-2 hidden sm:inline">Detalhes</span>
        </TabsTrigger>
        <TabsTrigger value="images">
            {icons.images}
            <span className="ml-2 hidden sm:inline">Imagens</span>
        </TabsTrigger>
         <TabsTrigger value="gallery">
            {icons.gallery}
            <span className="ml-2 hidden sm:inline">Galeria</span>
        </TabsTrigger>
        <TabsTrigger value="events" disabled>
            {icons.events}
            <span className="ml-2 hidden sm:inline">Eventos</span>
        </TabsTrigger>
        <TabsTrigger value="publications" disabled>
             {icons.publications}
            <span className="ml-2 hidden sm:inline">Publicações</span>
        </TabsTrigger>
        <TabsTrigger value="recipes" disabled>
             {icons.recipes}
            <span className="ml-2 hidden sm:inline">Receitas</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Pencil /> Editar Detalhes</CardTitle>
            <CardDescription>Atualize as informações públicas da sua confraria que todos podem ver.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Lema da Confraria</Label>
                <Input id="lema" name="lema" value={profile.lema || ''} onChange={handleInputChange} placeholder="O lema que vos representa" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Confraria</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">A Nossa História</Label>
              <Textarea id="description" name="description" placeholder="Descreva a missão e os valores da confraria..." className="min-h-[150px]" value={profile.description || ''} onChange={handleInputChange}/>
              <p className="text-xs text-muted-foreground">Este texto aparecerá na página pública.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label htmlFor="fundadores">Fundadores</Label>
                  <Input id="fundadores" name="fundadores" value={profile.fundadores || ''} onChange={handleInputChange} placeholder="Nomes dos fundadores" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="foundationYear">Ano de Fundação</Label>
                  <Input id="foundationYear" name="foundationYear" type="number" value={profile.foundationYear || ''} onChange={handleInputChange} placeholder="Ex: 1998" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="region">Região (Distrito)</Label>
                <Select value={profile.region || ''} onValueChange={handleSelectChange('region')}>
                    <SelectTrigger id="region">
                        <SelectValue placeholder="Selecione o distrito" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="council">Concelho</Label>
                    <Select value={profile.council || ''} onValueChange={handleSelectChange('council')} disabled={councils.length === 0}>
                        <SelectTrigger id="council">
                            <SelectValue placeholder="Selecione o concelho" />
                        </SelectTrigger>
                        <SelectContent>
                            {councils.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" type="url" value={profile.website || ''} onChange={handleInputChange} placeholder="https://asua-confraria.pt" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" name="facebook" type="url" value={profile.facebook || ''} onChange={handleInputChange} placeholder="https://facebook.com/asuaconfraria" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" name="instagram" type="url" value={profile.instagram || ''} onChange={handleInputChange} placeholder="https://instagram.com/asuaconfraria" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="images" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Imagens do Perfil</CardTitle>
            <CardDescription>Faça o upload do logótipo e do banner que aparecerão na página da confraria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label>Logótipo (Recomendado: 400x400px)</Label>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarImage src={profile.photoURL ?? undefined} alt="Logótipo preview" />
                  <AvatarFallback className="rounded-lg"><Camera/></AvatarFallback>
                </Avatar>
                <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} disabled={isUploading === 'logo'}/>
                <Button asChild variant="outline">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    {isUploading === 'logo' ? <Loader2 className="mr-2 animate-spin" /> : <ImageIcon className="mr-2"/>}
                    {isUploading === 'logo' ? 'A carregar...' : 'Alterar Logótipo'}
                  </Label>
                </Button>
              </div>
            </div>
             <div className="space-y-4">
              <Label>Banner (Recomendado: 1200x400px)</Label>
                <div className="w-full aspect-[3/1] rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">
                   {profile.bannerURL ? (
                      <Image src={profile.bannerURL} alt="Banner preview" width={1200} height={400} className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto" />
                        <p>Sem banner</p>
                      </div>
                   )}
                </div>
                 <Input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} disabled={isUploading === 'banner'}/>
                 <Button asChild variant="outline">
                  <Label htmlFor="banner-upload" className="cursor-pointer">
                    {isUploading === 'banner' ? <Loader2 className="mr-2 animate-spin" /> : <ImageIcon className="mr-2"/>}
                    {isUploading === 'banner' ? 'A carregar...' : 'Alterar Banner'}
                  </Label>
                </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Galeria de Imagens</CardTitle>
            <CardDescription>Carregue as fotos que melhor representam a sua confraria. Estas imagens aparecerão na sua página pública.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(profile.gallery || []).map((image) => (
                    <div key={image.id} className="relative group aspect-square">
                        <Image
                            src={image.url}
                            alt="Foto da galeria"
                            fill
                            className="object-cover rounded-lg border"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(image.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Label htmlFor="gallery-upload" className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    <div className="flex flex-col items-center justify-center">
                        {isUploading === 'gallery' ? (
                          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        ) : (
                          <PlusCircle className="w-8 h-8 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground mt-2 text-center">Adicionar</span>
                    </div>
                    <Input id="gallery-upload" type="file" className="hidden" multiple onChange={handleGalleryFileChange} accept="image/png, image/jpeg, image/gif" disabled={isUploading === 'gallery'}/>
                </Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
       <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || !!isUploading}>
            {(isSaving || !!isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Alterações
          </Button>
        </div>

    </Tabs>
  );
}
