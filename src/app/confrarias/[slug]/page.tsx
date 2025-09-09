
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Camera, Info, Mail, Pencil, MapPin, Globe, Facebook, Instagram, Newspaper, Users, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from 'next/navigation';
import { getUserProfile, getPostsByConfraria, getEventsByConfraria } from "@/app/actions";
import { ConfrariaProfileActions } from "@/components/confraria-profile-actions";
import Link from "next/link";
import { CreatePostWidget } from "@/components/create-post-widget";
import { PostCard } from "@/components/post-card";

// Mock data for tabs content, to be replaced later
const mockDetails = {
  recipes: [
    { id: 1, name: 'Robalo ao molho de Vinho do Porto', difficulty: 'Média', time: '45 min', image: 'https://picsum.photos/400/300?random=12', data_ai_hint: 'fish dish' },
  ],
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl?: string;
};


export default async function ConfrariaProfilePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [confrariaData, postsData, eventsData] = await Promise.all([
      getUserProfile(slug),
      getPostsByConfraria(slug),
      getEventsByConfraria(slug),
  ]);

  if (!confrariaData || confrariaData.role !== 'Confraria') {
    notFound();
  }

  const confraria = {
      id: confrariaData.id,
      name: confrariaData.name || 'Nome Indisponível',
      region: confrariaData.region || 'Região não definida',
      council: confrariaData.council || null,
      banner: confrariaData.bannerURL || 'https://picsum.photos/1200/400?random=10',
      data_ai_hint_banner: 'wine vineyard',
      logo: confrariaData.photoURL || null,
      contact: confrariaData.email || '',
      about: confrariaData.description || 'Nenhuma descrição sobre esta confraria ainda.',
      foundationYear: confrariaData.foundationYear || null,
      fundadores: confrariaData.fundadores || null,
      lema: confrariaData.lema || null,
      website: confrariaData.website,
      facebook: confrariaData.facebook,
      instagram: confrariaData.instagram,
      gallery: confrariaData.gallery || [],
      events: eventsData as Event[],
      ...mockDetails
  }

  return (
      <div className="w-full">
        <header className="relative h-64 md:h-80 w-full">
          <Image src={confraria.banner} alt={`Banner da ${confraria.name}`} fill className="object-cover" data-ai-hint={confraria.data_ai_hint_banner} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 container mx-auto">
             <div className="flex flex-col md:flex-row md:items-end md:gap-8">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg shrink-0 -mb-16 md:-mb-8 bg-card">
                  {confraria.logo && <AvatarImage src={confraria.logo} alt={`Logótipo da ${confraria.name}`} />}
                  <AvatarFallback className="text-4xl">{confraria.name.charAt(0)}</AvatarFallback>
                </Avatar>
             </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 md:pt-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                    <h1 className="font-headline font-bold text-3xl md:text-4xl text-primary">{confraria.name}</h1>
                    {confraria.lema && <p className="text-lg text-muted-foreground italic mt-1">"{confraria.lema}"</p>}
                    <p className="text-md text-muted-foreground flex items-center gap-2 mt-2"><MapPin className="h-5 w-5" /> {confraria.council ? `${confraria.council}, ${confraria.region}` : confraria.region}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 flex-wrap shrink-0">
                  <ConfrariaProfileActions confrariaId={confraria.id} />
                  {confraria.website && <Button variant="ghost" size="icon" asChild><Link href={confraria.website} target="_blank"><Globe /></Link></Button>}
                  {confraria.facebook && <Button variant="ghost" size="icon" asChild><Link href={confraria.facebook} target="_blank"><Facebook /></Link></Button>}
                  {confraria.instagram && <Button variant="ghost" size="icon" asChild><Link href={confraria.instagram} target="_blank"><Instagram /></Link></Button>}
                </div>
            </div>
          </div>

          <Tabs defaultValue="inicio" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="inicio">Início</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inicio" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna principal */}
                    <div className="lg:col-span-2 space-y-8">
                        <CreatePostWidget confrariaId={confraria.id} />
                        {/* Publicações */}
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary"><Newspaper /> Publicações</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-6">
                                {postsData.length > 0 ? (
                                    postsData.map((post: any) => (
                                        <PostCard key={post.id} post={post} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <p>Esta confraria ainda não tem publicações.</p>
                                    </div>
                                )}
                             </CardContent>
                        </Card>
                         {/* Próximos Eventos */}
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary"><Calendar /> Próximos Eventos</CardTitle>
                             </CardHeader>
                             <CardContent>
                                {confraria.events.length > 0 ? (
                                    <div className="space-y-4">
                                        {confraria.events.map((event) => (
                                            <div key={event.id} className="flex items-start md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                                <div className="flex items-start md:items-center gap-4 flex-1">
                                                    {event.imageUrl && (
                                                        <Image src={event.imageUrl} alt={event.title} width={80} height={80} className="rounded-lg object-cover w-20 h-20" />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg text-accent">{event.title}</p>
                                                        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })} - {event.location}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline"><Calendar className="mr-2" /> Adicionar</Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <p>De momento, não existem eventos agendados.</p>
                                    </div>
                                )}
                             </CardContent>
                        </Card>
                    </div>
                    {/* Coluna lateral */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary"><Clock /> A Nossa História</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p className="text-foreground/90">{confraria.about}</p>
                                {confraria.foundationYear && <p><span className="font-bold text-foreground">Ano de Fundação:</span> {confraria.foundationYear}</p>}
                            </CardContent>
                        </Card>
                        {confraria.fundadores && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary"><Users /> Fundadores</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/90">{confraria.fundadores}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Galeria</CardTitle></CardHeader>
                <CardContent>
                   {confraria.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {confraria.gallery.map((item: any) => (
                                <div key={item.id} className="overflow-hidden rounded-lg group">
                                <Image src={item.url} alt="Foto da galeria" width={400} height={300} className="rounded-lg object-cover aspect-square transition-transform duration-300 group-hover:scale-110" data-ai-hint={item.data_ai_hint || 'gallery image'} />
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                            <Camera className="h-12 w-12 mb-4" />
                            <p className="font-bold">Galeria Vazia</p>
                            <p className="text-sm">Esta confraria ainda não adicionou fotos à sua galeria.</p>
                        </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eventos" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Próximos Eventos</CardTitle></CardHeader>
                <CardContent>
                    {confraria.events.length > 0 ? (
                        <div className="space-y-4">
                            {confraria.events.map((event) => (
                                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div>
                                    <p className="font-bold text-lg text-accent">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })} - {event.location}</p>
                                    </div>
                                    <Button variant="outline"><Calendar className="mr-2" /> Adicionar</Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                            <Calendar className="h-12 w-12 mb-4" />
                            <p className="font-bold">Sem Eventos Agendados</p>
                            <p className="text-sm">De momento, não existem eventos agendados.</p>
                        </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="receitas" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Receitas da Confraria</CardTitle></CardHeader>
                <CardContent>
                   {confraria.recipes.length > 0 ? (
                      <div className="relative group overflow-hidden rounded-lg">
                        <Image src={confraria.recipes[0].image} alt={confraria.recipes[0].name} width={400} height={300} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={confraria.recipes[0].data_ai_hint} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 text-white">
                          <h3 className="font-bold text-lg">{confraria.recipes[0].name}</h3>
                          <div className="flex gap-4 text-sm"><span>Dificuldade: {confraria.recipes[0].difficulty}</span> <span>Tempo: {confraria.recipes[0].time}</span></div>
                        </div>
                      </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                            <BookOpen className="h-12 w-12 mb-4" />
                            <p className="font-bold">Sem Receitas</p>
                            <p className="text-sm">Ainda não foram publicadas receitas.</p>
                        </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
  );
}
