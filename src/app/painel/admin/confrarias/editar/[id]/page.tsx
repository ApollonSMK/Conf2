
import { ConfrariaAdminEditPage } from '@/components/confraria-admin-edit-page';

export default async function AdminEditConfrariaServerPage({ params }: { params: { id: string } }) {
  // This is now a server component. It can safely access params.
  const { id } = await params;
  
  // We pass the ID as a prop to the actual page component, which is a client component.
  return <ConfrariaAdminEditPage confrariaId={id} />;
}
