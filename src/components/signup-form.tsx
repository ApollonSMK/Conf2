
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
        // Handle signup logic here
        console.log('Signing up...');
    });
  }

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
              <Input id="name" placeholder="O seu nome" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="exemplo@email.com" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input id="password" type="password" required />
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
