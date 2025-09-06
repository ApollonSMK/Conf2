
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Home, BookOpen, Calendar, Compass, Grape } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Grape className="h-8 w-8" />
              <span className="font-headline font-bold text-2xl tracking-tight">
                Confrarias Portugal
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/inicio" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Home className="mr-2 h-4 w-4" /> Início
            </Link>
            <Link href="/explorar" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Compass className="mr-2 h-4 w-4" /> Descobertas
            </Link>
            <Link href="/confrarias" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <BookOpen className="mr-2 h-4 w-4" /> Confrarias
            </Link>
            <Link href="/eventos" className="flex items-center text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              <Calendar className="mr-2 h-4 w-4" /> Eventos
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button asChild variant="secondary" size="sm">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
