
'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getUserProfile } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfrariaEditForm } from '@/components/confraria-edit-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';


export default function AdminEditConfrariaPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const confrariaId = params.id;

  useEffect(() => {
    if (!confrariaId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = await getUserProfile(confrariaId);
        if (profileData && profileData.role === 'Confraria') {
          setProfile(profileData);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching confraria profile:', error);
        toast({ title: 'Erro', description: 'Não foi possível carregar o perfil da confraria.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [confrariaId, toast]);

  if (loading) {
    return (
      <div className="p-8 w-full">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2" />
          Voltar para a Lista
        </Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.photoURL ?? undefined} alt="Logo" />
            <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Perfil da Confraria (Admin)</h1>
            <p className="mt-1 text-muted-foreground">A alterar: {profile.name} ({profile.email})</p>
          </div>
        </div>
      </header>
      <ConfrariaEditForm confraria={profile} />
    </div>
  );
}
