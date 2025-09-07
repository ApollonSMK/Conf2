
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Camera, Heart, Info, Mail, MapPin, Share2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Mock data, in a real app this would come from a database
const confrariaDetails = {
  id: 1,
  name: 'Confraria do Vinho do Porto',
  region: 'Douro Litoral',
  banner: 'https://picsum.photos/1200/400?random=10',
  data_ai_hint_banner: 'wine vineyard',
  logo: 'https://picsum.photos/150/150?random=3',
  data_ai_hint_logo: 'wine logo',
  followers: 5400,
  contact: 'contacto@vinhodoporto.pt',
  social: {
    facebook: '#',
    instagram: '#',
    x: '#',
  },
  about: 'Fundada em 1982, a Confraria do Vinho do Porto tem como missão a defesa, promoção e prestígio do Vinho do Porto. Organizamos eventos, provas e workshops para entusiastas e profissionais, celebrando a rica herança deste vinho único no mundo.',
  foundationYear: 1982,
  members: ['António Silva', 'Maria Costa', 'João Pereira', 'Ana Santos'],
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

export default function ConfrariaProfilePage({ params }: { params: { slug: string } }) {
  const confraria = confrariaDetails;

  return (
    <>
      <Header />
      <main className="flex-grow">
        <div>
          <header className="relative h-64 md:h-80 w-full">
            <Image src={confraria.banner} alt={`Banner da ${confraria.name}`} fill className="object-cover" data-ai-hint={confraria.data_ai_hint_banner} />
            <div className="absolute inset-0 bg-black/50" />
          </header>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-16 md:-mt-24">
              <div className="flex flex-col md:flex-row md:items-end md:gap-8">
                <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-lg shrink-0">
                  <AvatarImage src={confraria.logo} alt={`Logótipo da ${confraria.name}`} data-ai-hint={confraria.data_ai_hint_logo} />
                  <AvatarFallback>{confraria.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4 md:mt-0 md:pb-4 flex-grow">
                  <h1 className="font-headline font-bold text-3xl md:text-4xl text-primary">{confraria.name}</h1>
                  <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1"><MapPin className="h-5 w-5" /> {confraria.region}</p>
                </div>
                <div className="mt-4 md:mt-0 md:pb-4 flex items-center gap-2 flex-wrap">
                  <Button variant="secondary"><Mail className="mr-2" /> Contactar</Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="events" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="recipes">Receitas</TabsTrigger>
                <TabsTrigger value="gallery">Galeria</TabsTrigger>
                <TabsTrigger value="about">Sobre</TabsTrigger>
              </TabsList>

              <TabsContent value="events" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Próximos Eventos</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-bold text-lg text-accent">{confraria.events[0].name}</p>
                        <p className="text-sm text-muted-foreground">{confraria.events[0].date} - {confraria.events[0].location}</p>
                      </div>
                      <Button variant="outline"><Calendar className="mr-2" /> Adicionar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recipes" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Receitas da Confraria</CardTitle></CardHeader>
                  <CardContent>
                    <div className="relative group overflow-hidden rounded-lg">
                      <Image src={confraria.recipes[0].image} alt={confraria.recipes[0].name} width={400} height={300} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={confraria.recipes[0].data_ai_hint} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="font-bold text-lg">{confraria.recipes[0].name}</h3>
                        <div className="flex gap-4 text-sm"><span>Dificuldade: {confraria.recipes[0].difficulty}</span> <span>Tempo: {confraria.recipes[0].time}</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Galeria</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {confraria.gallery.map(item => (
                      <div key={item.id} className="overflow-hidden rounded-lg group">
                        <Image src={item.url} alt="Foto da galeria" width={400} height={300} className="rounded-lg object-cover aspect-square transition-transform duration-300 group-hover:scale-110" data-ai-hint={item.data_ai_hint} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Sobre a Confraria</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg leading-relaxed text-foreground/90">{confraria.about}</p>
                    <p><span className="font-bold text-foreground">Ano de Fundação:</span> {confraria.foundationYear}</p>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Membros Fundadores</h3>
                      <div className="flex flex-wrap gap-2">
                        {confraria.members.map(member => <Badge key={member} variant="secondary">{member}</Badge>)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
