
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Camera, Info, Mail, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import { notFound } from 'next/navigation';
import { getUserProfile } from "@/app/actions";
import { ConfrariaProfileActions } from "@/components/confraria-profile-actions";

// Mock data for tabs content, to be replaced later
const mockDetails = {
  events: [
    { id: 1, name: 'Grande Prova de Vintages', date: '2024-11-15', location: 'Palácio da Bolsa, Porto' },
  ],
  recipes: [
    { id: 1, name: 'Robalo ao molho de Vinho do Porto', difficulty: 'Média', time: '45 min', image: 'https://picsum.photos/400/300?random=12', data_ai_hint: 'fish dish' },
  ],
  gallery: [
    { id: 1, url: 'https://picsum.photos/400/300?random=13', data_ai_hint: 'wine cellar' },
    { id: 2, url: 'https://picsum.photos/400/300?random=14', data_ai_hint: 'wine tasting' },
    { id: 3, url: 'https://picsum.photos/400/300?random=15', data_ai_hint: 'people cheering' },
    { id: 4, url: 'https://picsum.photos/400/300?random=16', data_ai_hint: 'douro valley' },
  ]
};

export default async function ConfrariaProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const confrariaData = await getUserProfile(slug);

  if (!confrariaData || confrariaData.role !== 'Confraria') {
    notFound();
  }

  const confraria = {
      id: confrariaData.id,
      name: confrariaData.name || 'Nome Indisponível',
      region: confrariaData.region || 'Região não definida',
      banner: confrariaData.bannerURL || 'https://picsum.photos/1200/400?random=10',
      data_ai_hint_banner: 'wine vineyard',
      logo: confrariaData.photoURL || null,
      contact: confrariaData.email || '',
      about: confrariaData.description || 'Nenhuma descrição sobre esta confraria ainda.',
      foundationYear: confrariaData.foundationYear || null,
      members: confrariaData.members || [],
      ...mockDetails
  }

  return (
      <div className="w-full">
        <header className="relative h-64 md:h-80 w-full">
          <Image src={confraria.banner} alt={`Banner da ${confraria.name}`} fill className="object-cover" data-ai-hint={confraria.data_ai_hint_banner} />
          <div className="absolute inset-0 bg-black/50" />
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 md:-mt-24">
            <div className="flex flex-col md:flex-row md:items-end md:gap-8">
              <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-lg shrink-0">
                {confraria.logo && <AvatarImage src={confraria.logo} alt={`Logótipo da ${confraria.name}`} />}
                <AvatarFallback>{confraria.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 md:pb-4 flex-grow">
                <h1 className="font-headline font-bold text-3xl md:text-4xl text-primary">{confraria.name}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="h-5 w-5" /> {confraria.region}</p>
              </div>
              <div className="mt-4 md:mt-0 md:pb-4 flex items-center gap-2 flex-wrap">
                <ConfrariaProfileActions confrariaId={confraria.id} />
                <Button variant="secondary" asChild><a href={`mailto:${confraria.contact}`}><Mail className="mr-2" /> Contactar</a></Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="about">Sobre</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="recipes">Receitas</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Sobre a Confraria</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed text-foreground/90">{confraria.about}</p>
                  {confraria.foundationYear && <p><span className="font-bold text-foreground">Ano de Fundação:</span> {confraria.foundationYear}</p>}
                  {confraria.members.length > 0 && (
                    <div>
                        <h3 className="font-bold text-foreground mb-2">Membros</h3>
                        <div className="flex flex-wrap gap-2">
                        {confraria.members.map((member: string) => <Badge key={member} variant="secondary">{member}</Badge>)}
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Próximos Eventos</CardTitle></CardHeader>
                <CardContent>
                    {confraria.events.length > 0 ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div>
                            <p className="font-bold text-lg text-accent">{confraria.events[0].name}</p>
                            <p className="text-sm text-muted-foreground">{confraria.events[0].date} - {confraria.events[0].location}</p>
                            </div>
                            <Button variant="outline"><Calendar className="mr-2" /> Adicionar</Button>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">De momento, não existem eventos agendados.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recipes" className="mt-6">
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
                        <p className="text-muted-foreground">Ainda não foram publicadas receitas.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Galeria</CardTitle></CardHeader>
                <CardContent>
                   {confraria.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {confraria.gallery.map(item => (
                                <div key={item.id} className="overflow-hidden rounded-lg group">
                                <Image src={item.url} alt="Foto da galeria" width={400} height={300} className="rounded-lg object-cover aspect-square transition-transform duration-300 group-hover:scale-110" data-ai-hint={item.data_ai_hint} />
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

          </Tabs>
        </div>
      </div>
  );
}
