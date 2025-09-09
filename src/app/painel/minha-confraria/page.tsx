
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Camera, Calendar, Info, Pencil, Newspaper, Image as ImageIcon, Utensils } from 'lucide-react';
import { ConfrariaEditForm } from '@/components/confraria-edit-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function MinhaConfrariaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          if (userProfile && userProfile.role === 'Confraria') {
            setProfile(userProfile);
          } else {
            // Not a confraria, redirect
            toast({ title: "Acesso Negado", description: "Esta área é exclusiva para confrarias.", variant: "destructive" });
            router.push('/painel');
          }
        } catch (error) {
          toast({ title: "Erro", description: "Não foi possível carregar os dados da sua confraria.", variant: "destructive" });
        }
      } else {
        // Not logged in, redirect
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, router, toast]);

  if (loading || !profile) {
    return (
      <div className="p-8 w-full">
        <Skeleton className="h-10 w-1/4 mb-2" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <header className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/confrarias/${profile.id}`}>
            <ArrowLeft className="mr-2" />
            Voltar à Página da Confraria
          </Link>
        </Button>
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary">Painel da {profile.name}</h1>
          <p className="mt-1 text-muted-foreground">Bem-vindo, Confrade Responsável. Gira a sua confraria a partir daqui.</p>
        </div>
      </header>

      <ConfrariaEditForm confraria={profile} />
    </div>
  );
}
