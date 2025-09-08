
import { EditDiscoveryClient } from '@/components/edit-discovery-client';

export default function EditarDescobertaPage({ params }: { params: { id: string } }) {
    // The page component is now a Server Component.
    // It can safely access params and pass the ID as a string prop to the client component.
    return <EditDiscoveryClient discoveryId={params.id} />;
}
