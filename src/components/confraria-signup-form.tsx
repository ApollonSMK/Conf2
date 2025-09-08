
'use client';

import { useTransition, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createConfrariaSubmission } from '@/app/actions';
import { districts } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ConfrariaSignupForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [councils, setCouncils] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtData = districts.find(d => d.name === selectedDistrict);
      setCouncils(districtData?.councils || []);
    } else {
      setCouncils([]);
    }
  }, [selectedDistrict]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
        try {
            const data = {
                confrariaName: formData.get('confrariaName') as string,
                responsibleName: formData.get('responsibleName') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                district: selectedDistrict,
                council: formData.get('council') as string,
                description: formData.get('description') as string,
            };

            const result = await createConfrariaSubmission(data);
            
            if (result.success) {
                 toast({
                    title: 'Pedido de Adesão Enviado!',
                    description: 'O seu pedido foi submetido. Entraremos em contacto em breve. Obrigado!',
                });
                (e.target as HTMLFormElement).reset();
                setSelectedDistrict('');
            } else {
                 throw new Error(result.error);
            }
        } catch (error: any) {
             toast({
                title: 'Erro',
                description: error.message || 'Não foi possível submeter o seu pedido. Tente novamente.',
                variant: 'destructive',
            });
        }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Formulário de Adesão</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para submeter o seu pedido de adesão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="confrariaName">Nome da Confraria *</Label>
                    <Input id="confrariaName" name="confrariaName" placeholder="Ex: Confraria do Queijo da Serra" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="responsibleName">Nome do Responsável *</Label>
                    <Input id="responsibleName" name="responsibleName" placeholder="O seu nome" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email de Contacto *</Label>
                    <Input id="email" name="email" type="email" placeholder="contacto@confraria.pt" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Telefone de Contacto *</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+351..." required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="district">Distrito *</Label>
                    <Select name="district" value={selectedDistrict} onValueChange={setSelectedDistrict} required>
                        <SelectTrigger id="district">
                            <SelectValue placeholder="Selecione o distrito" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map(d => (
                                <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="council">Concelho *</Label>
                    <Select name="council" disabled={!selectedDistrict} required>
                        <SelectTrigger id="council">
                            <SelectValue placeholder="Primeiro, selecione um distrito" />
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
                <Label htmlFor="description">Breve Descrição da Confraria</Label>
                <Textarea
                id="description"
                name="description"
                placeholder="Fale-nos um pouco sobre a sua confraria, a sua missão e os produtos que defende..."
                className="min-h-[120px]"
                />
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Pedido de Adesão
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

