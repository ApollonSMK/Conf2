
'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Loader2, Wifi, ParkingSquare, Accessibility, Dog, CreditCard, Umbrella, ToyBrick, CalendarCheck, ShoppingBag, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { createDiscovery } from '@/app/actions';
import { getAuth } from 'firebase/auth';

const amenitiesList = [
    { id: 'wifi', label: 'Wi-Fi Grátis', icon: Wifi },
    { id: 'parking', label: 'Estacionamento', icon: ParkingSquare },
    { id: 'accessibility', label: 'Acessível', icon: Accessibility },
    { id: 'pets', label: 'Aceita Animais', icon: Dog },
    { id: 'creditcard', label: 'Aceita Cartão', icon: CreditCard },
    { id: 'terrace', label: 'Esplanada', icon: Umbrella },
    { id: 'kids', label: 'Bom para Crianças', icon: ToyBrick },
    { id: 'reservations', label: 'Aceita Reservas', icon: CalendarCheck },
    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
    { id: 'delivery', label: 'Entrega ao Domicílio', icon: Truck },
];

export function NewDiscoveryForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const auth = getAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = auth.currentUser;

    if (!user) {
        toast({
            title: 'Erro',
            description: 'Precisa de estar autenticado para criar uma descoberta.',
            variant: 'destructive',
        });
        return;
    }
    
    const selectedAmenities = amenitiesList
      .filter(amenity => formData.get(amenity.id))
      .map(amenity => amenity.label);

    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        website: formData.get('website'),
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        amenities: selectedAmenities,
        author: user.displayName,
        authorId: user.uid,
    };

    startTransition(async () => {
        try {
            await createDiscovery(data);
            toast({
                title: 'Descoberta Partilhada!',
                description: 'A sua descoberta foi submetida para revisão. Obrigado por partilhar!',
            });
            // Optionally, reset form or redirect user
            (e.target as HTMLFormElement).reset();
        } catch (error) {
             toast({
                title: 'Erro',
                description: 'Não foi possível partilhar a sua descoberta. Tente novamente.',
                variant: 'destructive',
            });
        }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Detalhes da Descoberta</CardTitle>
          <CardDescription>Quanto mais detalhes partilhar, mais útil será para a comunidade.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Título e Descrição */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Título da Descoberta *</Label>
                    <Input id="title" name="title" placeholder="Ex: A melhor tasca de peixe grelhado do Algarve" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva o que torna este lugar ou produto tão especial..."
                    className="min-h-[150px]"
                    required
                    />
                </div>
            </div>

            <Separator />

            {/* Categoria */}
            <div className="space-y-4">
                 <Label>Tipo de Descoberta *</Label>
                 <RadioGroup defaultValue="place" name="category" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="Lugar" id="r-place" className="peer sr-only" />
                        <Label htmlFor="r-place" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            Lugar
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="Produto" id="r-product" className="peer sr-only" />
                        <Label htmlFor="r-product" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                           Produto
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="Pessoa" id="r-person" className="peer sr-only" />
                        <Label htmlFor="r-person" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                           Pessoa
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            
            <Separator />
            
            {/* Contactos e Localização */}
            <div className="space-y-4">
                 <h3 className="text-lg font-medium text-foreground">Localização e Contactos</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Morada</Label>
                        <Input id="address" name="address" placeholder="Rua, Número, Cidade" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+351..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="geral@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" type="url" placeholder="https://www.exemplo.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input id="facebook" name="facebook" type="url" placeholder="https://facebook.com/exemplo" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/exemplo" />
                    </div>
                </div>
            </div>

            <Separator />

             {/* Comodidades */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Comodidades</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {amenitiesList.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-3">
                            <Checkbox id={amenity.id} name={amenity.id} />
                            <Label htmlFor={amenity.id} className="font-normal flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <amenity.icon className="h-5 w-5 text-muted-foreground"/>
                                {amenity.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Imagens */}
            <div className="space-y-2">
                <Label htmlFor="photo">Fotografias</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para carregar</span> ou arraste e solte</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 5MB)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple />
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
