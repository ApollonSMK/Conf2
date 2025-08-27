import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Calendar,
  BookOpen,
  Filter,
  Search,
} from 'lucide-react';

const confrarias = [
  { id: 1, slug: 'confraria-do-queijo-serra-da-estrela', name: 'Confraria do Queijo Serra da Estrela', region: 'Beira Alta', followers: 1250, events: 15, recipes: 45, logo: 'https://picsum.photos/100/100?random=1', data_ai_hint: 'cheese logo' },
  { id: 2, slug: 'confraria-gastronomica-do-leitao-da-bairrada', name: 'Confraria Gastronómica do Leitão da Bairrada', region: 'Beira Litoral', followers: 2300, events: 22, recipes: 12, logo: 'https://picsum.photos/100/100?random=2', data_ai_hint: 'pig logo' },
  { id: 3, slug: 'confraria-do-vinho-do-porto', name: 'Confraria do Vinho do Porto', region: 'Douro Litoral', followers: 5400, events: 45, recipes: 5, logo: 'https://picsum.photos/100/100?random=3', data_ai_hint: 'wine logo' },
  { id: 4, slug: 'confraria-dos-sabores-de-tras-os-montes', name: 'Confraria dos Sabores de Trás-os-Montes', region: 'Trás-os-Montes', followers: 850, events: 8, recipes: 60, logo: 'https://picsum.photos/100/100?random=4', data_ai_hint: 'food logo' },
  { id: 5, slug: 'confraria-do-marisco-de-olhao', name: 'Confraria do Marisco de Olhão', region: 'Algarve', followers: 3100, events: 30, recipes: 35, logo: 'https://picsum.photos/100/100?random=5', data_ai_hint: 'seafood logo' },
  { id: 6, slug: 'confraria-da-broa-de-avintes', name: 'Confraria da Broa de Avintes', region: 'Douro Litoral', followers: 1500, events: 12, recipes: 18, logo: 'https://picsum.photos/100/100?random=6', data_ai_hint: 'bread logo' },
];

function ConfrariaCard({ confraria }: { confraria: (typeof confrarias)[0] }) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Image
          src={confraria.logo}
          alt={`Logótipo da ${confraria.name}`}
          width={80}
          height={80}
          className="rounded-full border-2 border-secondary"
          data-ai-hint={confraria.data_ai_hint}
        />
        <div>
          <CardTitle className="font-headline text-lg leading-tight text-primary">
            <Link href={`/confrarias/${confraria.slug}`} className="hover:underline">
              {confraria.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{confraria.region}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-around text-muted-foreground text-sm">
          <div className="text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p>
              <span className="font-bold text-foreground">{confraria.followers}</span> Seguidores
            </p>
          </div>
          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p>
              <span className="font-bold text-foreground">{confraria.events}</span> Eventos
            </p>
          </div>
          <div className="text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-accent" />
            <p>
              <span className="font-bold text-foreground">{confraria.recipes}</span> Receitas
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full" variant="secondary">
          <Link href={`/confrarias/${confraria.slug}`}>Ver Perfil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ConfrariasPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-primary mb-4">
          Confrarias de Portugal
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Descubra, siga e participe nas comunidades que celebram o melhor da
          gastronomia Portuguesa.
        </p>
      </section>

      <Card className="mb-8 p-4 md:p-6 bg-card/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <label htmlFor="search" className="text-sm font-medium text-foreground">
              Pesquisa
            </label>
            <Search className="absolute left-3 bottom-2.5 h-5 w-5 text-muted-foreground" />
            <Input id="search" placeholder="Nome da confraria..." className="pl-10 mt-1" />
          </div>
          <div>
            <label htmlFor="region" className="text-sm font-medium text-foreground">
              Região
            </label>
            <Select>
              <SelectTrigger id="region" className="mt-1">
                <SelectValue placeholder="Todas as regiões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="norte">Norte</SelectItem>
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="lisboa">Lisboa</SelectItem>
                <SelectItem value="alentejo">Alentejo</SelectItem>
                <SelectItem value="algarve">Algarve</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="sort" className="text-sm font-medium text-foreground">
              Ordenar por
            </label>
            <Select>
              <SelectTrigger id="sort" className="mt-1">
                <SelectValue placeholder="Mais seguidas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">Mais seguidas</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {confrarias.map((confraria) => (
          <ConfrariaCard key={confraria.id} confraria={confraria} />
        ))}
      </div>
    </div>
  );
}
