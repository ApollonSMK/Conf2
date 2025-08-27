import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Utensils, Search, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-secondary" />
              <span className="font-headline font-bold text-2xl tracking-tight">
                Sabores de Portugal
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-secondary transition-colors">
              Confrarias
            </Link>
            <Link href="/eventos" className="text-sm font-medium hover:text-secondary transition-colors">
              Eventos
            </Link>
            <Link href="/explorar" className="text-sm font-medium hover:text-secondary transition-colors">
              Explorar
            </Link>
            <Link href="/novo-post" className="text-sm font-medium hover:text-secondary transition-colors">
              Criar Post
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="pl-10 w-48 bg-primary-foreground text-primary placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="secondary" size="sm">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
