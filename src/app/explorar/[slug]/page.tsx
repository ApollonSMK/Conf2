
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Share2, Stamp, Globe, Mail, Phone, Clock, MapPin, Facebook, Instagram, Heart, Sparkles, Wifi, ParkingSquare, Accessibility, Dog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data, in a real app this would come from a database based on the slug
const descobertaDetails = {
    id: 1,
    slug: 'mercearia-do-ze',
    title: 'Mercearia do Zé',
    description: 'Uma pequena mercearia com os melhores queijos e enchidos da região. O Zé conhece todos os produtores! É um espaço acolhedor, com produtos de alta qualidade e um atendimento personalizado que faz toda a diferença. Recomendo vivamente uma visita para provar os queijos curados e o presunto caseiro.',
    images: [
        { id: 1, url: 'https://picsum.photos/800/600?random=31', data_ai_hint: 'grocery store interior' },
        { id: 2, url: 'https://picsum.photos/400/300?random=32', data_ai_hint: 'cheese selection' },
        { id: 3, url: 'https://picsum.photos/400/300?random=33', data_ai_hint: 'cured meats' },
    ],
    author: 'Maria Costa',
    authorAvatar: 'https://picsum.photos/100/100?random=51',
    data_ai_hint_author: 'woman portrait',
    category: 'Lugar',
    tags: ['Mercearia', 'Produtos Locais', 'Queijo', 'Trás-os-Montes'],
    selos: 1,
    comments: [
        { id: 1, author: 'António Silva', text: 'Confirmo! O queijo de cabra é divinal.', avatar: 'https://picsum.photos/100/100?random=52' },
        { id: 2, author: 'João Pereira', text: 'Fui lá na semana passada por causa desta partilha. Não desiludiu! Obrigado!', avatar: 'https://picsum.photos/100/100?random=53' },
    ],
    location: {
      address: 'Rua do Comércio, 123, 5300-000, Bragança',
      lat: 41.8058,
      lng: -6.7573,
    },
    contact: {
      phone: '+351 273 123 456',
      email: 'geral@merceariadoze.pt',
      website: 'https://www.merceariadoze.pt',
    },
    social: {
      facebook: 'https://facebook.com/merceariadoze',
      instagram: 'https://instagram.com/merceariadoze',
    },
    hours: [
        { day: 'Segunda - Sexta', time: '09:00 - 19:00' },
        { day: 'Sábado', time: '09:00 - 13:00' },
        { day: 'Domingo', time: 'Fechado' },
    ],
    amenities: [
        { name: 'Wi-Fi Grátis', icon: Wifi },
        { name: 'Estacionamento', icon: ParkingSquare },
        { name: 'Acessível a Cadeira de Rodas', icon: Accessibility },
        { name: 'Aceita Animais', icon: Dog },
    ]
};

export default function DescobertaPage({ params }: { params: { slug: string } }) {
    const descoberta = descobertaDetails;
    const gmapsUrl = descoberta.location?.lat && descoberta.location?.lng 
        ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${descoberta.location.lat},${descoberta.location.lng}`
        : '';
    
    const hasContactInfo = descoberta.contact?.website || descoberta.contact?.email || descoberta.contact?.phone || descoberta.social?.facebook || descoberta.social?.instagram;

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="p-0">
                        {descoberta.images && descoberta.images.length > 0 && (
                            <>
                                <div className="relative h-96 w-full">
                                    <Image src={descoberta.images[0].url} alt={descoberta.title} fill className="object-cover rounded-t-lg" data-ai-hint={descoberta.images[0].data_ai_hint} />
                                </div>
                                {descoberta.images.length > 1 && (
                                    <div className="grid grid-cols-2 gap-px bg-border">
                                        {descoberta.images.slice(1, 3).map(image => (
                                            <div key={image.id} className="relative h-48">
                                                <Image src={image.url} alt={descoberta.title} fill className="object-cover" data-ai-hint={image.data_ai_hint} />
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
                                {descoberta.category && <Badge variant="secondary" className="mb-2">{descoberta.category}</Badge>}
                                <CardTitle className="font-headline text-4xl text-primary">{descoberta.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                            <Button variant="outline">
                                    <Stamp className="h-5 w-5 mr-2" /> {descoberta.selos} Selo{descoberta.selos !== 1 && 's'}
                            </Button>
                            <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /> <span className="sr-only">Partilhar</span></Button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 my-6">
                            <Avatar>
                                <AvatarImage src={descoberta.authorAvatar} alt={descoberta.author} data-ai-hint={descoberta.data_ai_hint_author} />
                                <AvatarFallback>{descoberta.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-foreground">{descoberta.author}</p>
                                <p className="text-sm text-muted-foreground">Publicado a 15 de Julho de 2024</p>
                            </div>
                        </div>

                        <p className="text-lg leading-relaxed text-foreground/90 my-6">{descoberta.description}</p>
                        
                        {descoberta.tags && descoberta.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {descoberta.tags.map(tag => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {descoberta.comments && descoberta.comments.length > 0 && (
                        <CardContent>
                            <h3 className="font-headline text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                <MessageCircle className="h-6 w-6"/>
                                Comentários ({descoberta.comments.length})
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

                                {descoberta.comments.map(comment => (
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
                {descoberta.location?.address && (
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
                            <p className="mt-4 text-sm text-muted-foreground">{descoberta.location.address}</p>
                        </CardContent>
                    </Card>
                )}

                 {hasContactInfo && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Contactos e Redes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {descoberta.contact?.website && <Button asChild className="w-full"><Link href={descoberta.contact.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-2"/> Visitar Website</Link></Button>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {descoberta.contact?.email && <Button asChild variant="secondary" className="w-full"><Link href={`mailto:${descoberta.contact.email}`}><Mail className="mr-2"/> Email</Link></Button>}
                                {descoberta.contact?.phone && <Button asChild variant="secondary" className="w-full"><Link href={`tel:${descoberta.contact.phone}`}><Phone className="mr-2"/> Telefone</Link></Button>}
                            </div>
                            {(descoberta.social?.facebook || descoberta.social?.instagram) && (
                                <div className="flex justify-center items-center gap-4 pt-3">
                                    {descoberta.social.facebook && <Link href={descoberta.social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook /></Link>}
                                    {descoberta.social.instagram && <Link href={descoberta.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Instagram /></Link>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 )}
                
                {descoberta.hours && descoberta.hours.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock/> Horário</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="space-y-2 text-sm">
                            {descoberta.hours.map(h => (
                                <li key={h.day} className="flex justify-between">
                                    <span className="text-muted-foreground">{h.day}</span>
                                    <span className="font-medium text-foreground">{h.time}</span>
                                </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                )}

                 {descoberta.amenities && descoberta.amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles/> Comodidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                            {descoberta.amenities.map(amenity => (
                                <li key={amenity.name} className="flex items-center gap-2">
                                    <amenity.icon className="h-4 w-4 text-accent" />
                                    <span className="text-foreground">{amenity.name}</span>
                                </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                 )}
            </div>
           </div>
        </div>
    );
}
