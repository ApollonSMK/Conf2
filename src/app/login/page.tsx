
import { LoginForm } from '@/components/login-form';
import { Separator } from '@/components/ui/separator';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
      <main className="container mx-auto flex w-full min-h-[calc(100vh-18rem)] items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="font-headline font-bold text-4xl text-primary">Entrar</h1>
            <p className="mt-2 text-muted-foreground">
              Ainda não tem conta?{' '}
              <Link href="/registo" className="font-medium text-secondary hover:underline">
                Registe-se aqui.
              </Link>
            </p>
          </div>
          <LoginForm />
          <Separator />
           <div className="text-center">
             <Link href="/aderir-confraria" className="group inline-flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <UtensilsCrossed className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-12" />
                <span>Você é uma confraria? <span className="font-bold text-secondary group-hover:underline">Aderir aqui.</span></span>
            </Link>
           </div>
        </div>
      </main>
  );
}
