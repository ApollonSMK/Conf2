import Link from 'next/link';
import { Grape, MapPin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary-foreground/10 p-2 rounded-full">
                <Grape className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <span className="font-headline font-bold text-2xl tracking-tight">
                  Confrarias Portugal
                </span>
                <p className="text-sm text-primary-foreground/80">Tradição e Sabor</p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 max-w-md">
              Uma plataforma editorial dedicada às tradições gastronómicas portuguesas, onde cada descoberta é partilhada com a confiança e o carinho das antigas confrarias.
            </p>
            <div className="flex space-x-6 text-sm">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>Portugal</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>geral@confrariasportugal.pt</span>
                </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Confrarias</h3>
            <nav className="space-y-2 text-sm">
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confraria Báquica e Gastronómica...</Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confraria do Ovo de Ferreira do Zêzere</Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confraria Gastronómica do Bucho...</Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confraria dos Vinhos de Portugal...</Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confraria do Cultivo de Arroz...</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-headline font-bold text-lg mb-4">Navegação</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/inicio" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Início</Link>
              <Link href="/explorar" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Descobertas</Link>
              <Link href="/confrarias" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Confrarias</Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Painel do Confrade</Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} Confrarias.pt. Todos os direitos reservados.</p>
            <p className="italic mt-2 sm:mt-0">"Aqui não se navega. Aqui degusta-se cada descoberta."</p>
        </div>
      </div>
    </footer>
  );
}
