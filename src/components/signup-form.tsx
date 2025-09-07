
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addOrUpdateUser } from '@/app/actions';

type PasswordStrength = {
  score: number;
  label: string;
  color: string;
};

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const pass = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (pass !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As palavras-passe não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    
    startTransition(async () => {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        await addOrUpdateUser(user.uid, {
            name: name,
            email: user.email!,
            role: 'Confrade', // Default role
            status: 'Ativo' // Default status
        });

        toast({
            title: 'Conta Criada!',
            description: 'A sua conta foi criada com sucesso. A redirecionar para o login...',
        });
        
        setTimeout(() => {
          router.push('/login');
        }, 1500);

      } catch (error: any) {
        console.error("Firebase signup error:", error);
        let description = 'Ocorreu um erro ao criar a sua conta. Tente novamente.';
        if (error.code === 'auth/email-already-in-use') {
          description = 'Este endereço de email já está a ser utilizado.';
        } else if (error.code === 'auth/weak-password') {
          description = 'A palavra-passe é demasiado fraca. Tente uma mais forte.';
        }
        toast({
          title: 'Erro no Registo',
          description,
          variant: 'destructive',
        });
      }
    });
  }

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const passwordStrength = useMemo((): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if(password.length === 0) {
        return { score: 0, label: '', color: '' };
    }
    
    if (score < 3) {
      return { score: score * 20, label: 'Fraca', color: 'bg-destructive' };
    }
    if (score < 5) {
      return { score: score * 20, label: 'Média', color: 'bg-yellow-500' };
    }
    return { score: 100, label: 'Forte', color: 'bg-green-500' };
  }, [password]);


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Crie a sua conta</CardTitle>
          <CardDescription>Junte-se à comunidade e partilhe as suas descobertas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input name="name" id="name" placeholder="O seu nome" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" placeholder="exemplo@email.com" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <div className="relative">
                    <Input 
                      name="password"
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
                {password.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                        <Progress value={passwordStrength.score} className={`h-2 ${passwordStrength.color}`} />
                        <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Palavra-passe</Label>
                <div className="relative">
                    <Input name="confirm-password" id="confirm-password" type={showPassword ? 'text' : 'password'} required />
                     <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
           <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, concorda com os nossos{' '}
            <Link href="/termos" className="underline hover:text-primary">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="underline hover:text-primary">
              Política de Privacidade
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
