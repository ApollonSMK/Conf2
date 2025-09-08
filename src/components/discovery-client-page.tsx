
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Share2, Stamp, Globe, Mail, Phone, Clock, MapPin, Facebook, Instagram, Sparkles, Wifi, ParkingSquare, Accessibility, Dog, CreditCard, Umbrella, ToyBrick, CalendarCheck, ShoppingBag, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState, useTransition } from "react";
import { toggleSeal } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


const amenityIcons: { [key: string]: React.ElementType } = {
    'Wi-Fi Grátis': Wifi,
    'Estacionamento': ParkingSquare,
    'Acessível': Accessibility,
    'Aceita Animais': Dog,
    'Aceita Cartão': CreditCard,
    'Esplanada': Umbrella,
    'Bom para Crianças': ToyBrick,
    'Aceita Reservas': CalendarCheck,
    'Takeaway': ShoppingBag,
    'Entrega ao Domicílio': Truck,
};


export function DiscoveryClientPage({ discovery: initialDiscovery }: { discovery: any }) {
    const [discovery, setDiscovery] = useState(initialDiscovery);
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    const { toast } = useToast();
    const auth = getAuth();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (discovery.createdAt) {
            const date = new Date(discovery.createdAt);
            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            };
            setFormattedDate(new Intl.DateTimeFormat('pt-PT', options).format(date));
        }
    }, [discovery.createdAt]);


    const handleSealClick = () => {
        if (!user) {
            setIsLoginDialogOpen(true);
            return;
        }
        startTransition(async () => {
            const result = await toggleSeal(discovery.id, user.uid);
            if (result.success) {
                setDiscovery((prev: any) => ({
                    ...prev,
                    selos: result.sealed ? prev.selos + 1 : prev.selos - 1,
                    sealGivers: result.sealed 
                        ? [...(prev.sealGivers || []), user.uid] 
                        : (prev.sealGivers || []).filter((id: string) => id !== user.uid),
                }));
                 toast({
                    title: result.sealed ? "Selo Adicionado!" : "Selo Removido!",
                });
            } else {
                toast({
                    title: 'Erro',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };
    
    const userHasSealed = user ? discovery.sealGivers?.includes(user.uid) : false;

    const gmapsUrl = discovery.location?.lat && discovery.location?.lng 
        ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${discovery.location.lat},${discovery.location.lng}`
        : '';
    
    const hasContactInfo = discovery.contact?.website || discovery.contact?.email || discovery.contact?.phone || discovery.social?.facebook || discovery.social?.instagram;

    return (
    <>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="p-0">
                        {discovery.images && discovery.images.length > 0 && (
                            <>
                                <div className="relative h-96 w-full">
                                    <Image src={discovery.images[0].url} alt={discovery.title} fill className="object-cover rounded-t-lg" data-ai-hint={discovery.images[0].data_ai_hint} />
                                </div>
                                {discovery.images.length > 1 && (
                                    <div className="grid grid-cols-2 gap-px bg-border">
                                        {discovery.images.slice(1, 3).map((image:any, index: number) => (
                                            <div key={image.url || index} className="relative h-48">
                                                <Image src={image.url} alt={discovery.title} fill className="object-cover" data-ai-hint={image.data_ai_hint} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                {discovery.category && <Badge variant="secondary" className="mb-2">{discovery.category}</Badge>}
                                <CardTitle className="font-headline text-4xl text-primary">{discovery.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                            <Button variant={userHasSealed ? "default" : "outline"} onClick={handleSealClick} disabled={isPending || loadingAuth}>
                                    {isPending ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <Stamp className="h-5 w-5 mr-2" />
                                    )}
                                    {discovery.selos} Selo{discovery.selos !== 1 && 's'}
                            </Button>
                            <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /> <span className="sr-only">Partilhar</span></Button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 my-6">
                            <Avatar>
                                <AvatarImage src={discovery.authorAvatar} alt={discovery.author} data-ai-hint={discovery.data_ai_hint_author} />
                                <AvatarFallback>{discovery.author?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-foreground">{discovery.author}</p>
                                <p className="text-sm text-muted-foreground">Publicado a {formattedDate}</p>
                            </div>
                        </div>

                        <p className="text-lg leading-relaxed text-foreground/90 my-6">{discovery.description}</p>
                        
                        {discovery.tags && discovery.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {discovery.tags.map((tag: any) => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {discovery.comments && discovery.comments.length > 0 && (
                        <CardContent>
                            <h3 className="font-headline text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                <MessageCircle className="h-6 w-6"/>
                                Comentários ({discovery.comments.length})
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src="https://picsum.photos/100/100?random=50" data-ai-hint="user avatar" />
                                        <AvatarFallback>EU</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full relative">
                                        <Textarea placeholder="Deixe o seu comentário..." className="pr-12"/>
                                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-muted-foreground">
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {discovery.comments.map((comment: any) => (
                                    <div key={comment.id} className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarImage src={comment.avatar} alt={comment.author} data-ai-hint="user portrait" />
                                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-foreground">{comment.author}</p>
                                            <p className="text-foreground/90">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
            {/* Coluna Direita */}
            <div className="lg:col-span-1 space-y-8">
                {discovery.location?.address && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin/> Localização</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {gmapsUrl && (
                                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    style={{border:0}} 
                                    loading="lazy" 
                                    allowFullScreen 
                                    src={gmapsUrl}>
                                </iframe>
                                </div>
                            )}
                            <p className="mt-4 text-sm text-muted-foreground">{discovery.location.address}</p>
                        </CardContent>
                    </Card>
                )}

                 {hasContactInfo && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Contactos e Redes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {discovery.contact?.website && <Button asChild className="w-full"><Link href={discovery.contact.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-2"/> Visitar Website</Link></Button>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {discovery.contact?.email && <Button asChild variant="secondary" className="w-full"><Link href={`mailto:${discovery.contact.email}`}><Mail className="mr-2"/> Email</Link></Button>}
                                {discovery.contact?.phone && <Button asChild variant="secondary" className="w-full"><Link href={`tel:${discovery.contact.phone}`}><Phone className="mr-2"/> Telefone</Link></Button>}
                            </div>
                            {(discovery.social?.facebook || discovery.social?.instagram) && (
                                <div className="flex justify-center items-center gap-4 pt-3">
                                    {discovery.social.facebook && <Link href={discovery.social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook /></Link>}
                                    {discovery.social.instagram && <Link href={discovery.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram /></Link>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 )}
                
                {discovery.hours && discovery.hours.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock/> Horário</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="space-y-2 text-sm">
                            {discovery.hours.map((h: any) => (
                                <li key={h.day} className="flex justify-between">
                                    <span className="text-muted-foreground">{h.day}</span>
                                    <span className="font-medium text-foreground">{h.time}</span>
                                </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                )}

                 {discovery.amenities && discovery.amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles/> Comodidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                            {discovery.amenities.map((amenityName: string) => {
                                const AmenityIcon = amenityIcons[amenityName];
                                return AmenityIcon ? (
                                    <li key={amenityName} className="flex items-center gap-2">
                                        <AmenityIcon className="h-4 w-4 text-accent" />
                                        <span className="text-foreground">{amenityName}</span>
                                    </li>
                                ) : null;
                            })}
                        </ul>
                        </CardContent>
                    </Card>
                 )}
            </div>
           </div>
        </div>

        <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>É necessário ter uma conta</AlertDialogTitle>
                <AlertDialogDescription>
                  Para dar um selo a uma descoberta, precisa de iniciar sessão ou criar uma conta gratuita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <div className="flex flex-col sm:flex-row gap-2">
                    <AlertDialogAction asChild className="w-full sm:w-auto">
                        <Link href="/login">Entrar</Link>
                    </AlertDialogAction>
                    <AlertDialogAction asChild variant="secondary" className="w-full sm:w-auto">
                        <Link href="/registo">Registar</Link>
                    </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </>
    );
}
