
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getDiscoveriesByAuthor } from '@/app/actions';
import { BookOpen, PlusCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Discovery = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
};

export default function MinhasDescobertasPage() {
  const [user, setUser] = useState<User | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchDiscoveries(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchDiscoveries = async (uid: string) => {
    setLoading(true);
    const userDiscoveries = await getDiscoveriesByAuthor(uid);
    setDiscoveries(userDiscoveries as Discovery[]);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Minhas Descobertas</h1>
              <p className="mt-1 text-muted-foreground">Acompanhe e edite as suas partilhas.</p>
            </div>
             <Button asChild>
              <Link href="/explorar/nova">
                <PlusCircle className="mr-2" />
                Nova Descoberta
              </Link>
            </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>As suas Partilhas</CardTitle>
            <CardDescription>
                {loading 
                    ? "A carregar as suas descobertas..." 
                    : `Encontrámos ${discoveries.length} descoberta${discoveries.length !== 1 ? 's' : ''} sua.`
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : discoveries.length > 0 ? (
                  discoveries.map((discovery) => (
                    <TableRow key={discovery.id}>
                      <TableCell className="font-medium">{discovery.title}</TableCell>
                      <TableCell>{discovery.category}</TableCell>
                      <TableCell>{formatDate(discovery.createdAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            discovery.status === 'Aprovado'
                              ? 'secondary'
                              : discovery.status === 'Pendente'
                              ? 'outline'
                              : 'destructive'
                          }
                        >
                          {discovery.status}
                        </Badge>
                      </TableCell>
                       <TableCell className="text-right">
                         <Button asChild variant="ghost" size="icon">
                            <Link href={`/painel/descobertas/editar/${discovery.id}`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                            </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Ainda não partilhou nenhuma descoberta.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
