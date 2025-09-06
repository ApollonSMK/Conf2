
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const descobertas = [
  {
    id: 1,
    title: 'Mercearia do Zé',
    description: 'Uma pequena mercearia com os melhores queijos e enchidos da região. O Zé conhece todos os produtores!',
    image: 'https://picsum.photos/400/300?random=31',
    data_ai_hint: 'grocery store',
    author: 'Maria Costa',
  },
  {
    id: 2,
    title: 'Pastelaria Doce Encontro',
    description: 'Os melhores pastéis de nata que já comi, feitos com uma receita secreta de família.',
    image: 'https://picsum.photos/400/300?random=32',
    data_ai_hint: 'portuguese custard tarts',
    author: 'António Silva',
  },
  {
    id: 3,
    title: 'Tasca do Pescador',
    description: 'Peixe fresco grelhado na hora, mesmo em frente ao porto. Simples e delicioso.',
    image: 'https://picsum.photos/400/300?random=33',
    data_ai_hint: 'grilled fish',
    author: 'João Pereira',
  },
   {
    id: 4,
    title: 'Quinta do Vinho Bom',
    description: 'Uma adega familiar que oferece provas de vinhos incríveis com vista para o vale.',
    image: 'https://picsum.photos/400/300?random=34',
    data_ai_hint: 'wine tasting',
    author: 'Ana Santos',
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

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {descobertas.map((descoberta) => (
          <Card key={descoberta.id} className="flex flex-col overflow-hidden group">
             <div className="relative h-56">
                <Image src={descoberta.image} alt={descoberta.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={descoberta.data_ai_hint}/>
             </div>
             <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">{descoberta.title}</CardTitle>
             </CardHeader>
             <CardContent className="flex-grow">
                <p className="text-foreground/90">{descoberta.description}</p>
             </CardContent>
             <CardFooter>
                <p className="text-sm text-muted-foreground">Partilhado por: <span className="font-medium text-foreground">{descoberta.author}</span></p>
             </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
