
'use client';

import * as React from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Stamp } from 'lucide-react';
import { getDiscoveriesByAuthor } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

type Discovery = {
  id: string;
  selos?: number;
  [key: string]: any;
};

export default function PainelPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const [discoveries, setDiscoveries] = React.useState<Discovery[]>([]);
    const [totalSelosRecebidos, setTotalSelosRecebidos] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const auth = getAuth();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchDiscoveries(currentUser.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const fetchDiscoveries = async (uid: string) => {
        setLoading(true);
        try {
            const userDiscoveries = await getDiscoveriesByAuthor(uid) as Discovery[];
            setDiscoveries(userDiscoveries);

            // Calculate total selos recebidos
            const totalSelos = userDiscoveries.reduce((acc, discovery) => acc + (discovery.selos || 0), 0);
            setTotalSelosRecebidos(totalSelos);

        } catch (error) {
            console.error("Error fetching discoveries:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const stats = [
        { title: 'Descobertas Partilhadas', value: discoveries.length, icon: BookOpen, loading: loading },
        { title: 'Selos Recebidos', value: totalSelosRecebidos, icon: Award, loading: loading },
        { title: 'Selos Concedidos', value: 42, icon: Stamp, loading: false }, // Mocked data for now
    ];

    return (
        <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Painel do Confrade</h1>
            <p className="mt-1 text-muted-foreground">Bem-vindo de volta, Confrade! Aqui está um resumo da sua atividade.</p>
            </header>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                    {stat.loading ? (
                        <Skeleton className="h-7 w-12" />
                    ) : (
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    )}
                     <p className="text-xs text-muted-foreground">
                        {stat.title === 'Selos Concedidos' ? 'no total' : 'na sua atividade'}
                     </p>
                </CardContent>
                </Card>
            ))}
            </div>

            <div className="mt-8">
                {/* Futuro conteúdo do dashboard, como gráficos ou listas de atividade recente */}
            </div>

        </div>
        </DashboardLayout>
    );
}
