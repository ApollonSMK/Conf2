
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, PlusCircle, Stamp, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DiscoveryFilters } from '@/components/discovery-filters';
import { Badge } from '@/components/ui/badge';

const descobertas = [
  {
    id: 1,
    slug: 'mercearia-do-ze',
    title: 'Mercearia do Zé',
    description: 'Uma pequena mercearia com os melhores queijos e enchidos da região. O Zé conhece todos os produtores!',
    image: 'https://picsum.photos/400/300?random=31',
    data_ai_hint: 'grocery store',
    author: 'Maria Costa',
    location: 'Trás-os-Montes',
    category: 'Lugar',
    selos: 1,
  },
  {
    id: 2,
    slug: 'pastelaria-doce-encontro',
    title: 'Pastelaria Doce Encontro',
    description: 'Os melhores pastéis de nata que já comi, feitos com uma receita secreta de família.',
    image: 'https://picsum.photos/400/300?random=32',
    data_ai_hint: 'portuguese custard tarts',
    author: 'António Silva',
    location: 'Lisboa',
    category: 'Produto',
    selos: 5,
  },
  {
    id: 3,
    slug: 'tasca-do-pescador',
    title: 'Tasca do Pescador',
    description: 'Peixe fresco grelhado na hora, mesmo em frente ao porto. Simples e delicioso.',
    image: 'https://picsum.photos/400/300?random=33',
    data_ai_hint: 'grilled fish',
    author: 'João Pereira',
    location: 'Setúbal',
    category: 'Lugar',
    selos: 12,
  },
   {
    id: 4,
    slug: 'quinta-do-vinho-bom',
    title: 'Quinta do Vinho Bom',
    description: 'Uma adega familiar que oferece provas de vinhos incríveis com vista para o vale.',
    image: 'https://picsum.photos/400/300?random=34',
    data_ai_hint: 'wine tasting',
    author: 'Ana Santos',
    location: 'Douro',
    category: 'Lugar',
    selos: 8,
  },
];


export default function ExplorarPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="font-headline font-bold text-4xl text-primary">Descobertas da Comunidade</h1>
            <p className="mt-2 text-lg text-muted-foreground">Pérolas partilhadas pelos nossos membros. Encontre o seu próximo sabor favorito.</p>
        </div>
        <Button asChild>
            <Link href="/explorar/nova">
                <PlusCircle className="mr-2"/>
                Adicionar Descoberta
            </Link>
        </Button>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <DiscoveryFilters />
        </aside>
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {descobertas.map((descoberta) => (
              <Card key={descoberta.id} className="flex flex-col overflow-hidden group">
                 <Link href={`/explorar/${descoberta.slug}`} className="flex flex-col flex-grow">
                    <div className="relative h-56">
                        <Image src={descoberta.image} alt={descoberta.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={descoberta.data_ai_hint}/>
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">{descoberta.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-foreground/90 line-clamp-2">{descoberta.description}</p>
                         <div className="flex flex-wrap gap-2 items-center">
                            <Badge variant="secondary"><MapPin className="mr-1.5"/>{descoberta.location}</Badge>
                            <Badge variant="secondary"><Tag className="mr-1.5"/>{descoberta.category}</Badge>
                            <Badge variant="outline"><Stamp className="mr-1.5"/>{descoberta.selos} Selo{descoberta.selos !== 1 ? 's' : ''}</Badge>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Partilhado por: <span className="font-medium text-foreground">{descoberta.author}</span></p>
                    </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
