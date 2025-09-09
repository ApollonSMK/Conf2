
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
  Calendar,
  BookOpen,
  Filter,
  Search,
} from 'lucide-react';
import { getConfrarias } from '../actions';

type Confraria = {
  id: string;
  name: string;
  region: string;
  photoURL?: string | null;
  // These are mock for now
  events: number;
  recipes: number;
};

function ConfrariaCard({ confraria }: { confraria: Confraria }) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Image
          src={confraria.photoURL || 'https://picsum.photos/100/100'}
          alt={`Logótipo da ${confraria.name}`}
          width={80}
          height={80}
          className="rounded-full border-2 border-secondary"
          data-ai-hint={'logo'}
        />
        <div>
          <CardTitle className="font-headline text-lg leading-tight text-primary">
            <Link href={`/confrarias/${confraria.id}`} className="hover:underline">
              {confraria.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{confraria.region || 'Região não definida'}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-around text-muted-foreground text-sm">
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
          <Link href={`/confrarias/${confraria.id}`}>Ver Perfil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function ConfrariasPage() {
  const confrarias = (await getConfrarias()).map(c => ({
      ...c,
      // Add mock data for fields that don't exist yet
      events: Math.floor(Math.random() * 50),
      recipes: Math.floor(Math.random() * 50)
  })) as Confraria[];

  return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <section className="text-center mb-12">
          <h1 className="font-headline font-bold text-4xl md:text-5xl text-primary mb-4">
            As Nossas Confrarias
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            As guardiãs da tradição e do sabor. Conheça as irmandades que partilham o seu conhecimento e paixão por Portugal.
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
