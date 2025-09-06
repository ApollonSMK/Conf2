
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send, Share2 } from "lucide-react";
import Image from "next/image";

// Mock data, in a real app this would come from a database based on the slug
const descobertaDetails = {
    id: 1,
    slug: 'mercearia-do-ze',
    title: 'Mercearia do Zé',
    description: 'Uma pequena mercearia com os melhores queijos e enchidos da região. O Zé conhece todos os produtores! É um espaço acolhedor, com produtos de alta qualidade e um atendimento personalizado que faz toda a diferença. Recomendo vivamente uma visita para provar os queijos curados e o presunto caseiro.',
    image: 'https://picsum.photos/1200/600?random=31',
    data_ai_hint: 'grocery store interior',
    author: 'Maria Costa',
    authorAvatar: 'https://picsum.photos/100/100?random=51',
    data_ai_hint_author: 'woman portrait',
    category: 'Lugar',
    tags: ['Mercearia', 'Produtos Locais', 'Queijo', 'Trás-os-Montes'],
    comments: [
        { id: 1, author: 'António Silva', text: 'Confirmo! O queijo de cabra é divinal.', avatar: 'https://picsum.photos/100/100?random=52' },
        { id: 2, author: 'João Pereira', text: 'Fui lá na semana passada por causa desta partilha. Não desiludiu! Obrigado!', avatar: 'https://picsum.photos/100/100?random=53' },
    ]
};

export default function DescobertaPage({ params }: { params: { slug: string } }) {
    const descoberta = descobertaDetails;

    return (
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader className="p-0">
                     <div className="relative h-80 w-full">
                        <Image src={descoberta.image} alt={descoberta.title} fill className="object-cover rounded-t-lg" data-ai-hint={descoberta.data_ai_hint} />
                     </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="secondary" className="mb-2">{descoberta.category}</Badge>
                            <CardTitle className="font-headline text-4xl text-primary">{descoberta.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                           <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /> <span className="sr-only">Gostar</span></Button>
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
                    
                    <div className="flex flex-wrap gap-2">
                        {descoberta.tags.map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>

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
            </Card>
        </div>
    );
}
