
import { ConfrariaSignupForm } from '@/components/confraria-signup-form';

export default function AderirConfrariaPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 text-center">
          <h1 className="font-headline font-bold text-4xl text-primary">Adesão de Confraria</h1>
          <p className="text-lg text-muted-foreground">Junte a sua confraria à nossa comunidade e partilhe a sua paixão pela gastronomia portuguesa.</p>
        </div>
        <ConfrariaSignupForm />
      </div>
    </div>
  );
}
