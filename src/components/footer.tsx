import Link from 'next/link';
import { Grape } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 text-muted-foreground border-t">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
             <Grape className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold text-lg text-foreground">Confrarias Portugal</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/inicio" className="text-sm hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/termos" className="text-sm hover:text-primary transition-colors">
              Termos de Serviço
            </Link>
            <Link href="/privacidade" className="text-sm hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </nav>
          <div className="text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Confrarias Portugal. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
