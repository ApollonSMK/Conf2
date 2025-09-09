
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, Camera, BookOpen, Calendar, Info, Newspaper, Utensils, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser, uploadImage } from '@/app/actions';
import { districts } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

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
};

type ConfrariaEditFormProps = {
  confraria: ConfrariaProfile;
};

export function ConfrariaEditForm({ confraria }: ConfrariaEditFormProps) {
  const [profile, setProfile] = useState<ConfrariaProfile>(confraria);
  const [councils, setCouncils] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<null | 'logo' | 'banner'>(null);
  const { toast } = useToast();

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
      };
      
      const result = await updateUser(profile.id, dataToUpdate as any); // Cast to any to handle council addition

      if (result.success) {
        toast({ title: 'Sucesso!', description: 'Perfil da confraria atualizado.' });
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

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!profile) return;

    setIsUploading(type);
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: type === 'logo' ? 0.5 : 1.5,
        maxWidthOrHeight: type === 'logo' ? 400 : 1920,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append('file', compressedFile);
      const uploadResult = await uploadImage(formData);

      if (uploadResult.success && uploadResult.url) {
        const fieldToUpdate = type === 'logo' ? 'photoURL' : 'bannerURL';
        // Immediately update state to show preview
        setProfile(prevProfile => ({ ...prevProfile, [fieldToUpdate]: uploadResult.url }));
        // No need for a separate save for images, it will be saved with the main form
        toast({ title: 'Sucesso!', description: `${type === 'logo' ? 'Logótipo' : 'Banner'} carregado. Clique em "Guardar Alterações" para aplicar.` });
      } else {
        throw new Error(uploadResult.error || 'Falha no upload da imagem.');
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({ title: 'Erro de Upload', description: `Não foi possível carregar o ${type === 'logo' ? 'logótipo' : 'banner'}.`, variant: 'destructive' });
    } finally {
      setIsUploading(null);
    }
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
        <TabsTrigger value="events" disabled>
            {icons.events}
            <span className="ml-2 hidden sm:inline">Eventos</span>
        </TabsTrigger>
        <TabsTrigger value="publications" disabled>
             {icons.publications}
            <span className="ml-2 hidden sm:inline">Publicações</span>
        </TabsTrigger>
        <TabsTrigger value="gallery" disabled>
            {icons.gallery}
            <span className="ml-2 hidden sm:inline">Galeria</span>
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
                <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')} disabled={isUploading === 'logo'}/>
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
                 <Input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')} disabled={isUploading === 'banner'}/>
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
      
       <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || !!isUploading}>
            {(isSaving || !!isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Alterações
          </Button>
        </div>

    </Tabs>
  );
}
