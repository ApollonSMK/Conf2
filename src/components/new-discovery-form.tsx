
'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Loader2 } from 'lucide-react';

export function NewDiscoveryForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
        // In a real app, this would submit the form data to the server
        toast({
            title: 'Descoberta Partilhada!',
            description: 'A sua descoberta foi submetida com sucesso. Obrigado por partilhar!',
        });
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Detalhes da Descoberta</CardTitle>
          <CardDescription>Preencha os detalhes abaixo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Descoberta</Label>
            <Input id="title" placeholder="Ex: A melhor tasca de peixe grelhado do Algarve" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o que torna este lugar ou produto tão especial..."
              className="min-h-[150px]"
              required
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="location">Localização (opcional)</Label>
            <Input id="location" placeholder="Ex: Rua da Praia, 123, Faro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Fotografia</Label>
            <div className="flex items-center justify-center w-full">
                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para carregar</span> ou arraste e solte</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" />
                </Label>
            </div> 
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Partilhar Descoberta
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
