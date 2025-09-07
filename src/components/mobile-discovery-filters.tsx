
'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { DiscoveryFilters } from './discovery-filters';

export function MobileDiscoveryFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full border-primary">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Refine a sua busca para encontrar a descoberta perfeita.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto flex-grow">
          <DiscoveryFilters />
        </div>
        <SheetFooter>
            <SheetClose asChild>
                <Button className="w-full">Aplicar Filtros</Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
