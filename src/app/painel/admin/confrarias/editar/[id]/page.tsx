
'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser } from '@/app/actions';

type ConfrariaProfile = {
  name: string;
  email: string;
  photoURL: string;
  // Add other profile fields here as they are created
  // e.g. description, region, etc.
};

export default function AdminEditConfrariaPage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<ConfrariaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { id: confrariaId } = params;

  useEffect(() => {
    if (!confrariaId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', confrariaId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfile(userDocSnap.data() as ConfrariaProfile);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching confraria profile:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o perfil da confraria.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [confrariaId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const result = await updateUser(confrariaId, {
        name: profile.name,
        // photoURL: profile.photoURL, // Add logic for image upload if needed
      });

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Perfil da confraria atualizado.',
        });
        router.back();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível guardar as alterações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return null; // or a not found component
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
                <AvatarImage src={profile.photoURL} />
                <AvatarFallback>{profile.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
                 <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Perfil da Confraria</h1>
                 <p className="mt-1 text-muted-foreground">A alterar: {profile.name} ({profile.email})</p>
            </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>
            Altere as informações públicas da confraria aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Confraria</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          {/* Add other editable fields here, e.g., Textarea for description */}
           <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva a missão e os valores da confraria..."
              className="min-h-[150px]"
              // value={profile.description}
              // onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    