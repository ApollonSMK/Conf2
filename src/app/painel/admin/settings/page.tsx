
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

function AdManager() {
  const [desktopAdPreview, setDesktopAdPreview] = useState('https://picsum.photos/728/90');
  const [mobileAdPreview, setMobileAdPreview] = useState('https://picsum.photos/320/100');
  const [inFeedAdPreview, setInFeedAdPreview] = useState('https://picsum.photos/300/250');
  const [isPending, setIsPending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsPending(true);
    // In a real app, you would upload the files and save the URLs
    setTimeout(() => {
        // Here you would call a server action to upload images and save URLs
        setIsPending(false);
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Anúncios</CardTitle>
        <CardDescription>
          Faça o upload e gira as imagens para os espaços publicitários da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Desktop Ad */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Anúncio de Topo (Desktop)</h3>
          <div className="p-4 border-2 border-dashed rounded-lg">
            <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md min-h-[90px]">
                <Image src={desktopAdPreview} width={728} height={90} alt="Pré-visualização do anúncio desktop" className="max-w-full h-auto" data-ai-hint="advertisement banner"/>
            </div>
          </div>
           <Input id="desktopAd" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setDesktopAdPreview)} />
           <Button asChild variant="outline">
                <Label htmlFor="desktopAd" className="cursor-pointer">
                    <ImageIcon className="mr-2" />
                    Alterar Imagem (728x90)
                </Label>
            </Button>
        </div>

        {/* Mobile Ad */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Anúncio de Topo (Mobile)</h3>
           <div className="p-4 border-2 border-dashed rounded-lg">
             <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md">
                <Image src={mobileAdPreview} width={320} height={100} alt="Pré-visualização do anúncio mobile" data-ai-hint="advertisement banner" />
            </div>
           </div>
           <Input id="mobileAd" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setMobileAdPreview)} />
            <Button asChild variant="outline">
                <Label htmlFor="mobileAd" className="cursor-pointer">
                    <ImageIcon className="mr-2" />
                    Alterar Imagem (320x100)
                </Label>
            </Button>
        </div>

        {/* In-Feed Ad */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Anúncio In-Feed (Explorar)</h3>
           <div className="p-4 border-2 border-dashed rounded-lg">
             <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md">
                <Image src={inFeedAdPreview} width={300} height={250} alt="Pré-visualização do anúncio in-feed" data-ai-hint="advertisement banner" />
            </div>
           </div>
            <Input id="inFeedAd" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setInFeedAdPreview)} />
             <Button asChild variant="outline">
                <Label htmlFor="inFeedAd" className="cursor-pointer">
                    <ImageIcon className="mr-2" />
                    Alterar Imagem (300x250)
                </Label>
            </Button>
        </div>
      </CardContent>
       <CardFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Alterações
          </Button>
        </CardFooter>
    </Card>
  )
}

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Definições da Plataforma</h1>
            <p className="mt-1 text-muted-foreground">Gerir as configurações globais do site, como os anúncios.</p>
          </div>
        </div>
      </header>
      <AdManager />
    </div>
  );
}
