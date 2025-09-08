
'use client';

import { useTransition, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Loader2, Wifi, ParkingSquare, Accessibility, Dog, CreditCard, Umbrella, ToyBrick, CalendarCheck, ShoppingBag, Truck, X, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { createDiscovery, updateDiscovery, uploadImage } from '@/app/actions';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { districts } from '@/lib/regions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

type DiscoveryFormProps = {
    discovery?: any;
}

export function DiscoveryForm({ discovery }: DiscoveryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const auth = getAuth();
  const router = useRouter();
  const isEditMode = !!discovery;

  // State for location dropdowns
  const [selectedDistrict, setSelectedDistrict] = useState(discovery?.location?.district || '');
  const [councils, setCouncils] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtData = districts.find(d => d.name === selectedDistrict);
      setCouncils(districtData?.councils || []);
    } else {
      setCouncils([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (isEditMode && discovery?.images) {
        setImagePreviews(discovery.images.map((img: any) => img.url));
    }
    if (isEditMode && discovery?.location?.district) {
        setSelectedDistrict(discovery.location.district);
    }
  }, [discovery, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newImagePreviews]);
  };
  
  const handleRemoveImage = (index: number) => {
    setImageFiles(currentFiles => currentFiles.filter((_, i) => i !== index));
    setImagePreviews(currentPreviews => currentPreviews.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = auth.currentUser;

    if (!user) {
        toast({
            title: 'Erro',
            description: 'Precisa de estar autenticado para criar ou editar uma descoberta.',
            variant: 'destructive',
        });
        return;
    }
    
    startTransition(async () => {
        try {
            // 1. Upload new images
            const uploadedImageUrls = [];
            
            if(imageFiles.length > 0) {
              toast({ title: 'A processar imagens...', description: 'Por favor, aguarde.'});
            }

            for (const file of imageFiles) {
                 const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                });

                const imageFormData = new FormData();
                imageFormData.append('file', compressedFile);
                const result = await uploadImage(imageFormData);

                if (result.success && result.url) {
                    uploadedImageUrls.push({ url: result.url, data_ai_hint: 'user upload' });
                } else {
                    throw new Error(result.error || 'Falha no upload de uma imagem.');
                }
            }

            // 2. Combine existing and new images
            const existingImages = isEditMode && Array.isArray(discovery.images)
              ? discovery.images.filter((img: any) => imagePreviews.includes(img.url))
              : [];
            const finalImages = [...existingImages, ...uploadedImageUrls];


            const selectedAmenities = amenitiesList
              .filter(amenity => formData.get(amenity.id))
              .map(amenity => amenity.label);

            const data = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                images: finalImages,
                location: {
                    address: formData.get('address') as string,
                    district: selectedDistrict,
                    council: formData.get('council') as string,
                },
                contact: {
                     phone: formData.get('phone') as string,
                     email: formData.get('email') as string,
                     website: formData.get('website') as string,
                },
                social: {
                    facebook: formData.get('facebook') as string,
                    instagram: formData.get('instagram') as string,
                },
                amenities: selectedAmenities,
                author: user.displayName,
                authorId: user.uid,
                authorAvatar: user.photoURL || '',
            };

            if(isEditMode) {
                 await updateDiscovery(discovery.id, data);
                 toast({
                    title: 'Descoberta Atualizada!',
                    description: 'As suas alterações foram guardadas com sucesso.',
                });
                 router.push('/painel/descobertas');
            } else {
                await createDiscovery(data);
                toast({
                    title: 'Descoberta Partilhada!',
                    description: 'A sua descoberta foi submetida para revisão. Obrigado por partilhar!',
                });
                (e.target as HTMLFormElement).reset();
                setImageFiles([]);
                setImagePreviews([]);
                setSelectedDistrict('');
            }
        } catch (error: any) {
             toast({
                title: 'Erro',
                description: error.message || 'Não foi possível guardar a sua descoberta. Tente novamente.',
                variant: 'destructive',
            });
        }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Descoberta' : 'Detalhes da Descoberta'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Altere os detalhes da sua descoberta abaixo.'
              : 'Quanto mais detalhes partilhar, mais útil será para a comunidade.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Título e Descrição */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Título da Descoberta *</Label>
                    <Input id="title" name="title" placeholder="Ex: A melhor tasca de peixe grelhado do Algarve" defaultValue={discovery?.title} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva o que torna este lugar ou produto tão especial..."
                    className="min-h-[150px]"
                    defaultValue={discovery?.description}
                    required
                    />
                </div>
            </div>

            <Separator />

            {/* Categoria */}
            <div className="space-y-4">
                 <Label>Tipo de Descoberta *</Label>
                 <RadioGroup defaultValue={discovery?.category || "Lugar"} name="category" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <Input id="address" name="address" placeholder="Rua, Número, Código Postal" defaultValue={discovery?.location?.address}/>
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
                        <Select name="council" defaultValue={discovery?.location?.council} disabled={!selectedDistrict} required>
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
                     <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+351..." defaultValue={discovery?.contact?.phone}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="geral@exemplo.com" defaultValue={discovery?.contact?.email}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" type="url" placeholder="https://www.exemplo.com" defaultValue={discovery?.contact?.website}/>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input id="facebook" name="facebook" type="url" placeholder="https://facebook.com/exemplo" defaultValue={discovery?.social?.facebook}/>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/exemplo" defaultValue={discovery?.social?.instagram}/>
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
                            <Checkbox id={amenity.id} name={amenity.id} defaultChecked={discovery?.amenities?.includes(amenity.label)} />
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
            <div className="space-y-4">
                <Label htmlFor="photo">Fotografias</Label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative group aspect-square">
                            <Image
                                src={src}
                                alt={`Preview ${index}`}
                                fill
                                className="object-cover rounded-lg border"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                        <div className="flex flex-col items-center justify-center">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleImageChange} accept="image/png, image/jpeg, image/gif"/>
                    </Label>
                </div> 
            </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Guardar Alterações' : 'Partilhar Descoberta'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
