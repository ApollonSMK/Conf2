
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addOrUpdateUser } from '@/app/actions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    startTransition(async () => {
      try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user document exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
             // If document doesn't exist, create it
            await addOrUpdateUser(user.uid, {
                name: user.displayName || email.split('@')[0], // Fallback for name
                email: user.email!,
                role: 'Confrade', // Default role for existing users
                status: 'Ativo'   // Default status for existing users
            });
        }
        
        toast({
          title: 'Login efetuado!',
          description: 'Bem-vindo de volta. A redirecionar...',
        });

        router.push('/painel');

      } catch (error: any) {
        console.error("Firebase login error:", error);
        let description = 'Ocorreu um erro ao tentar entrar. Verifique as suas credenciais.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = 'Email ou palavra-passe incorretos.';
        }
        toast({
          title: 'Erro no Login',
          description,
          variant: 'destructive',
        });
      }
    });
  }

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo de volta!</CardTitle>
          <CardDescription>Insira as suas credenciais para aceder à sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="exemplo@email.com" required />
            </div>
            <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Link href="#" className="text-sm text-muted-foreground hover:underline">
                        Esqueceu-se?
                    </Link>
                </div>
                 <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required />
                    <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </div>
            
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
           <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              OU CONTINUE COM
            </span>
          </div>
           <Button variant="outline" className="w-full">
            {/* Em breve: <IconoGoogle className="mr-2 h-4 w-4" /> */}
            Google
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
