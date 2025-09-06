
import { LoginForm } from '@/components/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  );
}
