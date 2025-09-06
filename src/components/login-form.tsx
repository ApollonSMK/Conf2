
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';


export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
        // Handle login logic here
        console.log('Logging in...');
    });
  }

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
                <Input id="email" type="email" placeholder="exemplo@email.com" required />
            </div>
            <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="password">Palavra-passe</Label>
                    <Link href="#" className="text-sm text-muted-foreground hover:underline">
                        Esqueceu-se?
                    </Link>
                </div>
                <Input id="password" type="password" required />
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

