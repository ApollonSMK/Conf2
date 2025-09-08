
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

type AdType = 'desktop' | 'mobile' | 'in-feed';

type AdSlot = {
  id: AdType;
  title: string;
  dimensions: string;
  previewUrl: string;
  width: number;
  height: number;
};

const initialAdSlots: AdSlot[] = [
  { 
    id: 'desktop', 
    title: 'Anúncio de Topo (Desktop)', 
    dimensions: '728x90', 
    previewUrl: 'https://picsum.photos/728/90', 
    width: 728, 
    height: 90 
  },
  { 
    id: 'mobile', 
    title: 'Anúncio de Topo (Mobile)', 
    dimensions: '320x100', 
    previewUrl: 'https://picsum.photos/320/100', 
    width: 320, 
    height: 100 
  },
  { 
    id: 'in-feed', 
    title: 'Anúncio In-Feed (Explorar)', 
    dimensions: '300x250', 
    previewUrl: 'https://picsum.photos/300/250', 
    width: 300, 
    height: 250 
  },
];

function AdManager() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>(initialAdSlots);
  const [isPending, setIsPending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, adId: AdType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdSlots(currentSlots =>
          currentSlots.map(slot =>
            slot.id === adId ? { ...slot, previewUrl: reader.result as string } : slot
          )
        );
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
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Anúncios</CardTitle>
        <CardDescription>
          Faça o upload e gira as imagens ou GIFs para os espaços publicitários da plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {adSlots.map(slot => (
          <div key={slot.id} className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium text-lg">{slot.title}</h3>
            <div className="p-4 border-2 border-dashed rounded-lg">
              <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md" style={{ minHeight: slot.height, minWidth: slot.width }}>
                  <Image 
                    src={slot.previewUrl} 
                    width={slot.width} 
                    height={slot.height} 
                    alt={`Pré-visualização do anúncio ${slot.title}`} 
                    className="max-w-full h-auto" 
                    data-ai-hint="advertisement banner"
                  />
              </div>
            </div>
             <Input 
                id={`${slot.id}Ad`} 
                type="file" 
                className="sr-only" 
                onChange={(e) => handleFileChange(e, slot.id)} 
                accept="image/png, image/jpeg, image/gif"
            />
             <Button asChild variant="outline">
                  <Label htmlFor={`${slot.id}Ad`} className="cursor-pointer">
                      <ImageIcon className="mr-2" />
                      Alterar Imagem/GIF ({slot.dimensions})
                  </Label>
              </Button>
          </div>
        ))}
      </CardContent>
       <CardFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Alterações
          </Button>
        </CardFooter>
    </Card>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
      <header>
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
