
'use client';

import { EditDiscoveryClient } from '@/components/edit-discovery-client';

export default function EditarDescobertaPage({ params }: { params: { id: string } }) {
    // The page component simply extracts the id and passes it to a dedicated client component.
    // This avoids accessing `params` inside hooks incorrectly.
    return <EditDiscoveryClient discoveryId={params.id} />;
}
