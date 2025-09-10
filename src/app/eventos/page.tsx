
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEventsByConfraria, getConfrarias } from '@/app/actions';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  imageUrl?: string;
  confrariaId: string;
  confrariaName?: string;
  confrariaLogo?: string;
};

export const dynamic = 'force-dynamic';

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-56 w-full">
        <Image
          src={event.imageUrl || 'https://picsum.photos/400/300'}
          alt={event.title}
          fill
          className="object-cover"
          data-ai-hint="event promotion"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge>{new Date(event.date).toLocaleDateString('pt-PT', { month: 'long', day: 'numeric' })}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Calendar className="h-4 w-4" />
          {new Date(event.date).toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </CardDescription>
         <CardDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
      </CardContent>
      <CardContent className="border-t pt-4">
        <div className="flex items-center justify-between">
           <Link href={`/confrarias/${event.confrariaId}`} className="flex items-center gap-2 group">
              <Image
                src={event.confrariaLogo || 'https://picsum.photos/40/40'}
                alt={event.confrariaName || 'Logo da Confraria'}
                width={40}
                height={40}
                className="rounded-full border-2 border-secondary"
              />
              <div>
                <p className="text-xs text-muted-foreground">Organizado por</p>
                <p className="font-semibold text-foreground group-hover:underline">{event.confrariaName}</p>
              </div>
           </Link>
           <Button variant="secondary">Ver Detalhes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EventCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <Skeleton className="h-56 w-full" />
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
             <CardContent className="border-t pt-4">
                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                         <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-4 w-28" />
                         </div>
                     </div>
                    <Skeleton className="h-10 w-28" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const confrarias = await getConfrarias();
        const confrariaMap = new Map(confrarias.map(c => [c.id, { name: c.name, logo: c.photoURL }]));

        const allEventPromises = confrarias.map(c => getEventsByConfraria(c.id));
        const allEventsArrays = await Promise.all(allEventPromises);
        
        const flattenedEvents = allEventsArrays.flat().map(event => ({
          ...event,
          confrariaName: confrariaMap.get(event.confrariaId)?.name,
          confrariaLogo: confrariaMap.get(event.confrariaId)?.logo,
        }));

        flattenedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(flattenedEvents as Event[]);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <section className="text-center mb-12">
        <h1 className="font-headline font-bold text-4xl md:text-5xl text-primary mb-4">
          Calendário de Eventos
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Descubra os próximos encontros, festivais e celebrações organizados pelas nossas confrarias em todo o país.
        </p>
      </section>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground">
             <Calendar className="h-16 w-16 mx-auto mb-4" />
             <p className="font-bold text-xl">Nenhum evento agendado</p>
             <p>Volte em breve para novas atualizações.</p>
          </div>
        ) : (
          events.map(event => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </main>
  );
}
