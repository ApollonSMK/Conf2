
'use client';

import { getDiscoveryById } from '@/app/actions';
import { DiscoveryForm } from '@/components/new-discovery-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export default function EditarDescobertaPage({ params }: { params: { id: string } }) {
    const [discovery, setDiscovery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiscovery = async () => {
            const discoveryId = params.id;
            if (!discoveryId) return;
            try {
                setLoading(true);
                const fetchedDiscovery = await getDiscoveryById(discoveryId);
                if (fetchedDiscovery) {
                    setDiscovery(fetchedDiscovery);
                } else {
                    setError("Descoberta não encontrada.");
                }
            } catch (err) {
                setError("Ocorreu um erro ao carregar a descoberta.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscovery();
    }, []);


    if (loading) {
        return (
            <div className="w-full">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
                     <div className="space-y-4 text-center mb-8">
                        <Skeleton className="h-10 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                    </div>
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        )
    }

    if (error) {
         return (
            <div className="w-full">
                <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 text-center">
                    <h1 className="font-headline font-bold text-4xl text-destructive">Erro</h1>
                    <p className="text-lg text-muted-foreground mt-4">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-4 text-center">
                    <h1 className="font-headline font-bold text-4xl text-primary">Editar Descoberta</h1>
                    <p className="text-lg text-muted-foreground">Ajuste os detalhes da sua partilha para a manter atualizada.</p>
                </div>
                <DiscoveryForm discovery={discovery} />
            </div>
        </div>
    );
}
