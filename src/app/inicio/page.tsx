import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Destaques = [
  {
    id: 1,
    title: 'A Arte da Charcutaria',
    description: 'Descubra os segredos dos enchidos portugueses.',
    image: 'https://picsum.photos/600/400?random=21',
    data_ai_hint: 'smoked sausages',
    link: '#',
  },
  {
    id: 2,
    title: 'Queijos de Portugal',
    description: 'Uma viagem pelos sabores e texturas dos queijos nacionais.',
    image: 'https://picsum.photos/600/400?random=22',
    data_ai_hint: 'assorted cheese',
    link: '#',
  },
];

export default function InicioPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <section className="flex-grow flex items-center justify-center text-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Utensils className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="font-headline font-bold text-5xl md:text-6xl text-primary mb-4">
            Confrarias Gastronómicas
          </h1>
          <p className="font-headline text-xl text-muted-foreground italic mb-6">
            &quot;Aqui não se navega. Aqui degusta-se cada descoberta.&quot;
          </p>
          <p className="max-w-2xl mx-auto text-lg text-foreground/90 mb-8">
            Uma plataforma editorial onde cada entrada representa uma descoberta
            viva, uma história partilhada com a confiança das antigas confrarias
            portuguesas.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/explorar">
                Explorar Descobertas <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/confrarias">Conhecer as Confrarias</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline font-bold text-4xl text-primary text-center mb-10">
            Destaques
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {Destaques.map((destaque) => (
              <Card key={destaque.id} className="overflow-hidden group">
                <Link href={destaque.link}>
                  <div className="relative h-64">
                    <Image
                      src={destaque.image}
                      alt={destaque.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={destaque.data_ai_hint}
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6 bg-card absolute bottom-0 w-full">
                    <h3 className="font-headline font-bold text-xl text-primary mb-2">
                      {destaque.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {destaque.description}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
