
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AddDiscoveryButton } from '@/components/add-discovery-button';
import { MapPin, Stamp, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DiscoveryFilters } from '@/components/discovery-filters';
import { Badge } from '@/components/ui/badge';
import { MobileDiscoveryFilters } from '@/components/mobile-discovery-filters';
import { useEffect, useState } from 'react';
import { getDiscoveries } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';

type Discovery = {
    id: string;
    slug: string;
    title: string;
    description: string;
    images: { url: string; data_ai_hint: string }[];
    author: string;
    location: { address: string, council: string, district: string };
    category: string;
    selos: number;
}

function AdCard() {
    return (
        <Card className="flex flex-col overflow-hidden group">
             <CardHeader>
                <CardTitle className="font-headline text-xs text-muted-foreground text-center">Publicidade</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                 <Image src="https://picsum.photos/300/250" alt="Publicidade" width={300} height={250} className="rounded-md object-cover" data-ai-hint="advertisement banner" />
            </CardContent>
        </Card>
    )
}


export default function ExplorarPage() {
    const [descobertas, setDescobertas] = useState<Discovery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscoveries = async () => {
            setLoading(true);
            const discoveryList = await getDiscoveries();
            setDescobertas(discoveryList as Discovery[]);
            setLoading(false);
        };

        fetchDiscoveries();
    }, []);

  return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-headline font-bold text-4xl text-primary">Descobertas da Comunidade</h1>
            <p className="mt-2 text-lg text-muted-foreground">Pérolas partilhadas pelos nossos membros. Encontre o seu próximo sabor favorito.</p>
          </div>
          <AddDiscoveryButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="hidden md:block md:col-span-1">
            <DiscoveryFilters />
          </aside>
          <main className="md:col-span-3">
            <div className="md:hidden mb-6">
              <MobileDiscoveryFilters />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="flex flex-col overflow-hidden group">
                    <div className="relative h-56">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex flex-wrap gap-2 items-center">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </CardContent>
                    <CardFooter><Skeleton className="h-4 w-1/2" /></CardFooter>
                  </Card>
                ))
              ) : (
                descobertas.flatMap((descoberta, index) => {
                  const items = [(
                    <Card key={descoberta.id} className="flex flex-col overflow-hidden group">
                      <Link href={`/explorar/${descoberta.id}`} className="flex flex-col flex-grow">
                        <div className="relative h-56">
                          <Image src={(descoberta.images && descoberta.images.length > 0 && descoberta.images[0].url) || 'https://picsum.photos/400/300'} alt={descoberta.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={(descoberta.images && descoberta.images.length > 0 && descoberta.images[0].data_ai_hint) || 'food place'} />
                        </div>
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-primary">{descoberta.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                          <p className="text-foreground/90 line-clamp-2">{descoberta.description}</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            {descoberta.location?.council && (
                              <Badge variant="secondary"><MapPin className="mr-1.5" />{`${descoberta.location.council}, ${descoberta.location.district}`}</Badge>
                            )}
                            <Badge variant="secondary"><Tag className="mr-1.5" />{descoberta.category}</Badge>
                            <Badge variant="outline"><Stamp className="mr-1.5" />{descoberta.selos || 0} Selo{descoberta.selos !== 1 ? 's' : ''}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <p className="text-sm text-muted-foreground">Partilhado por: <span className="font-medium text-foreground">{descoberta.author}</span></p>
                        </CardFooter>
                      </Link>
                    </Card>
                  )];

                  if ((index + 1) % 4 === 0) {
                    items.push(<AdCard key={`ad-${index}`} />);
                  }

                  return items;
                })
              )}
            </div>
          </main>
        </div>
      </div>
  );
}
