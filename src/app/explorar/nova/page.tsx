
import { NewDiscoveryForm } from '@/components/new-discovery-form';

export default function NovaDescobertaPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 text-center">
          <h1 className="font-headline font-bold text-4xl text-primary">Partilhar uma Descoberta</h1>
          <p className="text-lg text-muted-foreground">Encontrou um lugar, produto ou sabor que vale a pena partilhar? Adicione-o aqui!</p>
        </div>
        <NewDiscoveryForm />
      </div>
    </div>
  );
}
