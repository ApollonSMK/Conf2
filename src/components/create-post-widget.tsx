
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getUserProfile } from '@/app/actions';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Separator } from './ui/separator';
import { ImageIcon, CalendarPlus, Utensils } from 'lucide-react';
import Link from 'next/link';

interface CreatePostWidgetProps {
  confrariaId: string;
}

export function CreatePostWidget({ confrariaId }: CreatePostWidgetProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        setUserRole(profile?.role || null);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCreatePostClick = () => {
    router.push('/novo-post');
  };

  if (loading) {
    return null; // Don't show anything while checking auth
  }

  const isOwner = user?.uid === confrariaId;
  const isAdmin = userRole === 'Admin';

  if (!isOwner && !isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Link href="/painel">
             <Avatar>
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <Button
            variant="outline"
            className="h-12 flex-1 justify-start rounded-full bg-muted/80 hover:bg-muted text-muted-foreground text-base"
            onClick={handleCreatePostClick}
          >
            Escreva uma publicação...
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-2">
            <Button variant="ghost" onClick={handleCreatePostClick}>
                <ImageIcon className="text-green-500" />
                <span className="ml-2">Foto/Vídeo</span>
            </Button>
             <Button variant="ghost" disabled>
                <CalendarPlus className="text-red-500" />
                <span className="ml-2">Evento</span>
            </Button>
             <Button variant="ghost" disabled>
                <Utensils className="text-blue-500" />
                <span className="ml-2">Receita</span>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
