
'use client';

import { useEffect, useState, useTransition } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Image as ImageIcon, Camera, BookOpen, Calendar, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserProfile, updateUser, uploadImage } from '@/app/actions';
import { districts } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

type ConfrariaProfile = {
  name: string;
  email: string;
  photoURL?: string;
  description?: string;
  region?: string;
  foundationYear?: number | string;
  bannerURL?: string;
};

export default function AdminEditConfrariaPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<ConfrariaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<null | 'logo' | 'banner'>(null);
  const { toast } = useToast();
  const router = useRouter();
  const confrariaId = params.id;

  useEffect(() => {
    if (!confrariaId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await getUserProfile(confrariaId);
        if (profileData) {
          setProfile(profileData as ConfrariaProfile);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching confraria profile:', error);
        toast({ title: 'Erro', description: 'Não foi possível carregar o perfil da confraria.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [confrariaId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    if (!profile) return;
    setProfile({ ...profile, region: value });
  };

  const handleSave = async (section: 'info' | 'images') => {
    if (!profile) return;

    setIsSaving(true);
    try {
      let dataToUpdate: Partial<ConfrariaProfile> = {};

      if (section === 'info') {
        dataToUpdate = {
          name: profile.name,
          description: profile.description,
          region: profile.region,
          foundationYear: profile.foundationYear,
        };
      } else if (section === 'images') {
        dataToUpdate = {
          photoURL: profile.photoURL,
          bannerURL: profile.bannerURL,
        };
      }
      
      const result = await updateUser(confrariaId, dataToUpdate);

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
        await updateUser(confrariaId, { [fieldToUpdate]: uploadResult.url });
        setProfile({ ...profile, [fieldToUpdate]: uploadResult.url });
        toast({ title: 'Sucesso!', description: `${type === 'logo' ? 'Logótipo' : 'Banner'} atualizado.` });
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

  if (loading) {
    return (
      <div className="p-8 w-full">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2" />
          Voltar para a Lista
        </Button>
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={profile.photoURL ?? undefined} alt="Logo" />
                <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
                 <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Perfil da Confraria</h1>
                 <p className="mt-1 text-muted-foreground">A alterar: {profile.name} ({profile.email})</p>
            </div>
        </div>
      </header>

      <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="recipes" disabled>Receitas</TabsTrigger>
              <TabsTrigger value="events" disabled>Eventos</TabsTrigger>
              <TabsTrigger value="gallery" disabled>Galeria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Altere as informações públicas da confraria aqui.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Confraria</Label>
                        <Input id="name" name="name" value={profile.name} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="foundationYear">Ano de Fundação</Label>
                        <Input id="foundationYear" name="foundationYear" type="number" value={profile.foundationYear} onChange={handleInputChange} placeholder="Ex: 1998" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Região</Label>
                     <Select value={profile.region} onValueChange={handleSelectChange}>
                        <SelectTrigger id="region">
                            <SelectValue placeholder="Selecione a região/distrito" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" placeholder="Descreva a missão e os valores da confraria..." className="min-h-[150px]" value={profile.description} onChange={handleInputChange}/>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSave('info')} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Informações
                  </Button>
                </CardFooter>
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

          <TabsContent value="recipes" className="mt-6">
             <Card>
                <CardHeader><CardTitle>Gerir Receitas</CardTitle></CardHeader>
                <CardContent className="text-center text-muted-foreground p-12">
                   <BookOpen className="h-12 w-12 mx-auto mb-4" />
                   <p className="font-bold">Em Construção</p>
                   <p>A funcionalidade de gestão de receitas estará disponível em breve.</p>
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="events" className="mt-6">
             <Card>
                <CardHeader><CardTitle>Gerir Eventos</CardTitle></CardHeader>
                <CardContent className="text-center text-muted-foreground p-12">
                   <Calendar className="h-12 w-12 mx-auto mb-4" />
                   <p className="font-bold">Em Construção</p>
                   <p>A funcionalidade de gestão de eventos estará disponível em breve.</p>
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="gallery" className="mt-6">
             <Card>
                <CardHeader><CardTitle>Gerir Galeria</CardTitle></CardHeader>
                <CardContent className="text-center text-muted-foreground p-12">
                   <Camera className="h-12 w-12 mx-auto mb-4" />
                   <p className="font-bold">Em Construção</p>
                   <p>A funcionalidade de gestão de galeria estará disponível em breve.</p>
                </CardContent>
              </Card>
          </TabsContent>

      </Tabs>
    </div>
  );
}
