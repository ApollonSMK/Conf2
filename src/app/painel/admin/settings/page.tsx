
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Image as ImageIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type AdType = 'desktop' | 'mobile' | 'in-feed';

type AdDefinition = {
  type: AdType;
  title: string;
  dimensions: string;
  width: number;
  height: number;
};

const adDefinitions: AdDefinition[] = [
  { type: 'desktop', title: 'Anúncio de Topo (Desktop)', dimensions: '728x90', width: 728, height: 90 },
  { type: 'mobile', title: 'Anúncio de Topo (Mobile)', dimensions: '320x100', width: 320, height: 100 },
  { type: 'in-feed', title: 'Anúncio In-Feed (Explorar)', dimensions: '300x250', width: 300, height: 250 },
];

type AdSlot = {
  id: string; // Unique ID for each ad instance
  type: AdType;
  previewUrl: string;
};

const initialAdSlots: AdSlot[] = [
  { id: '1', type: 'desktop', previewUrl: 'https://picsum.photos/728/90' },
  { id: '2', type: 'mobile', previewUrl: 'https://picsum.photos/320/100' },
  { id: '3', type: 'in-feed', previewUrl: 'https://picsum.photos/300/250' },
];

function AdManager() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>(initialAdSlots);
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdType, setNewAdType] = useState<AdType | ''>('');
  const [newAdUrl, setNewAdUrl] = useState('');
  const { toast } = useToast();

  const getAdDefinition = (type: AdType): AdDefinition => {
    return adDefinitions.find(def => def.type === type)!;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, adId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would first upload the file to a service (like R2)
      // and then update the state with the returned URL.
      // For now, we'll use a local blob URL for preview.
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
    // In a real app, you would save the adSlots array to your database.
    // This would likely involve mapping over the slots and saving their type and URL.
    toast({
        title: "Alterações a serem guardadas...",
        description: "Numa aplicação real, isto guardaria a configuração na base de dados."
    });
    setTimeout(() => {
        setIsPending(false);
        toast({
            title: "Simulação Concluída",
            description: "As alterações foram guardadas (simulado)."
        });
    }, 1500);
  };
  
  const handleAddNewAd = () => {
    if (!newAdType || !newAdUrl) {
      toast({ title: 'Erro', description: 'Por favor, selecione um tipo e insira um URL.', variant: 'destructive'});
      return;
    }
    const newAd: AdSlot = {
      id: new Date().getTime().toString(), // Simple unique ID
      type: newAdType,
      previewUrl: newAdUrl,
    };
    setAdSlots(prev => [...prev, newAd]);
    setNewAdType('');
    setNewAdUrl('');
    setIsModalOpen(false);
    toast({ title: 'Sucesso', description: 'Novo banner de anúncio adicionado.'});
  };

  const handleRemoveAd = (idToRemove: string) => {
    setAdSlots(prev => prev.filter(ad => ad.id !== idToRemove));
    toast({ title: 'Anúncio Removido', description: 'O banner foi removido da lista.', variant: 'destructive'});
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Gestão de Anúncios</CardTitle>
            <CardDescription>
              Adicione, remova e gira os banners para os espaços publicitários da plataforma.
            </CardDescription>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Adicionar Anúncio
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Anúncio</DialogTitle>
                    <DialogDescription>
                        Escolha o tipo de anúncio e forneça a imagem a ser usada.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                       <Label htmlFor="adType">Tipo de Anúncio</Label>
                       <Select value={newAdType} onValueChange={(value) => setNewAdType(value as AdType)}>
                           <SelectTrigger id="adType">
                               <SelectValue placeholder="Selecione o tipo de banner" />
                           </SelectTrigger>
                           <SelectContent>
                               {adDefinitions.map(def => (
                                   <SelectItem key={def.type} value={def.type}>{def.title} ({def.dimensions})</SelectItem>
                               ))}
                           </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="adUrl">URL da Imagem/GIF</Label>
                        <Input 
                          id="adUrl" 
                          placeholder="https://exemplo.com/imagem.gif" 
                          value={newAdUrl}
                          onChange={(e) => setNewAdUrl(e.target.value)}
                        />
                         <p className="text-xs text-muted-foreground">Cole aqui o URL da imagem. Upload direto em breve.</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
                    <Button onClick={handleAddNewAd}>Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-8">
        {adSlots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum anúncio configurado.</p>
            <p>Clique em "Adicionar Anúncio" para começar.</p>
          </div>
        ) : (
          adSlots.map(slot => {
            const def = getAdDefinition(slot.type);
            return (
              <div key={slot.id} className="space-y-4 p-4 border rounded-lg relative group">
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover este anúncio?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação é irreversível. O banner será removido da lista de anúncios.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveAd(slot.id)} className="bg-destructive hover:bg-destructive/90">Sim, remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <h3 className="font-medium text-lg">{def.title}</h3>
                <div className="p-4 border-2 border-dashed rounded-lg">
                  <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md" style={{ minHeight: def.height, maxWidth: def.width }}>
                      <Image 
                        src={slot.previewUrl} 
                        width={def.width} 
                        height={def.height} 
                        alt={`Pré-visualização do anúncio ${def.title}`} 
                        className="max-w-full h-auto object-contain" 
                        unoptimized={slot.previewUrl.endsWith('.gif')}
                        data-ai-hint="advertisement banner"
                      />
                  </div>
                </div>
                 <Input 
                    id={`${slot.id}-upload`} 
                    type="file" 
                    className="sr-only" 
                    onChange={(e) => handleFileChange(e, slot.id)} 
                    accept="image/png, image/jpeg, image/gif"
                />
                 <Button asChild variant="outline">
                      <Label htmlFor={`${slot.id}-upload`} className="cursor-pointer">
                          <ImageIcon className="mr-2" />
                          Alterar Imagem/GIF ({def.dimensions})
                      </Label>
                  </Button>
              </div>
            )
          })
        )}
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
