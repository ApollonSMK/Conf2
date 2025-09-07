
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SignupForm } from '@/components/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h1 className="font-headline font-bold text-4xl text-primary">Criar Conta</h1>
              <p className="mt-2 text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-medium text-secondary hover:underline">
                  Faça login aqui.
                </Link>
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
