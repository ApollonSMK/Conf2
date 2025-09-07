
'use client';

import { useState, useTransition, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/app/actions';
import { Loader2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function DefinicoesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const auth = getAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || '');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleProfileUpdate = () => {
    if (!user) return;
    startTransition(async () => {
        const result = await updateUser(user.uid, { name });
        if(result.success) {
            toast({ title: "Sucesso", description: "O seu nome foi atualizado." });
        } else {
            toast({ title: "Erro", description: result.error, variant: 'destructive' });
        }
    });
  };

  const handlePasswordUpdate = () => {
    if(!user || !user.email) return;
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Erro", description: "As novas palavras-passe não coincidem.", variant: 'destructive' });
      return;
    }
     if (newPassword.length < 6) {
      toast({ title: "Erro", description: "A nova palavra-passe deve ter pelo menos 6 caracteres.", variant: 'destructive' });
      return;
    }

    startTransition(async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast({ title: "Sucesso", description: "A sua palavra-passe foi alterada." });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch(error) {
            toast({ title: "Erro", description: "A palavra-passe atual está incorreta ou ocorreu um erro.", variant: 'destructive' });
        }
    });
  };

  if (loading) {
    return <DashboardLayout><div>A carregar...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Definições</h1>
          <p className="mt-1 text-muted-foreground">Gira as informações da sua conta e preferências.</p>
        </header>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize o seu nome e email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleProfileUpdate} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Alterações
                </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Palavra-passe</CardTitle>
              <CardDescription>Recomendamos que use uma palavra-passe forte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Palavra-passe Atual</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Palavra-passe</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmar Nova Palavra-passe</Label>
                <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
              </div>
            </CardContent>
             <CardFooter>
                <Button onClick={handlePasswordUpdate} disabled={isPending}>
                     {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Alterar Palavra-passe
                </Button>
            </CardFooter>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gira as suas preferências de comunicação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Newsletter Semanal</Label>
                        <p className="text-sm text-muted-foreground">
                            Receba um resumo das melhores descobertas da semana.
                        </p>
                    </div>
                    <Switch />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Alertas de Atividade</Label>
                        <p className="text-sm text-muted-foreground">
                            Seja notificado sobre comentários e selos nas suas descobertas.
                        </p>
                    </div>
                    <Switch defaultChecked/>
                </div>
            </CardContent>
          </Card>

           <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Estas ações são permanentes e não podem ser desfeitas.</CardDescription>
            </CardHeader>
            <CardContent>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2 className="mr-2" />
                        Eliminar a minha conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. A sua conta e todas as suas descobertas serão permanentemente eliminadas da nossa base de dados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Sim, eliminar conta</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
