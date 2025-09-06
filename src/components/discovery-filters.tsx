
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Filter, Search, WandSparkles, X } from 'lucide-react';

export function DiscoveryFilters() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="h-6 w-6 text-primary" />
                    <h2 className="font-headline text-2xl font-bold text-primary">Filtros</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="search" className="text-sm font-medium text-foreground mb-2 block">Pesquisar</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="search" placeholder="Ex: Vinho do Porto..." className="pl-10" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="district" className="text-sm font-medium text-foreground mb-2 block">Distrito</Label>
                        <Select>
                            <SelectTrigger id="district">
                                <SelectValue placeholder="Todos os distritos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aveiro">Aveiro</SelectItem>
                                <SelectItem value="beja">Beja</SelectItem>
                                <SelectItem value="braga">Braga</SelectItem>
                                <SelectItem value="braganca">Bragança</SelectItem>
                                <SelectItem value="castelo-branco">Castelo Branco</SelectItem>
                                <SelectItem value="coimbra">Coimbra</SelectItem>
                                <SelectItem value="evora">Évora</SelectItem>
                                <SelectItem value="faro">Faro</SelectItem>
                                <SelectItem value="guarda">Guarda</SelectItem>
                                <SelectItem value="leiria">Leiria</SelectItem>
                                <SelectItem value="lisboa">Lisboa</SelectItem>
                                <SelectItem value="portalegre">Portalegre</SelectItem>
                                <SelectItem value="porto">Porto</SelectItem>
                                <SelectItem value="santarem">Santarém</SelectItem>
                                <SelectItem value="setubal">Setúbal</SelectItem>
                                <SelectItem value="viana-do-castelo">Viana do Castelo</SelectItem>
                                <SelectItem value="vila-real">Vila Real</SelectItem>
                                <SelectItem value="viseu">Viseu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                         <Label htmlFor="council" className="text-sm font-medium text-foreground mb-2 block">Concelho</Label>
                        <Select disabled>
                            <SelectTrigger id="council">
                                <SelectValue placeholder="Todos os concelhos" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Options would be populated based on district */}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">Tipo</Label>
                        <RadioGroup defaultValue="all" className="space-y-2">
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="r-all"/>
                                <Label htmlFor="r-all" className="font-normal cursor-pointer p-2 w-full rounded-md data-[state=checked]:bg-muted">Todos os tipos</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="place" id="r-place" />
                                <Label htmlFor="r-place" className="font-normal cursor-pointer p-2 w-full rounded-md hover:bg-muted/50">Lugar</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="person" id="r-person" />
                                <Label htmlFor="r-person" className="font-normal cursor-pointer p-2 w-full rounded-md hover:bg-muted/50">Pessoa</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="product" id="r-product" />
                                <Label htmlFor="r-product" className="font-normal cursor-pointer p-2 w-full rounded-md hover:bg-muted/50">Produto</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Separator />
                    
                    <div className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                            <X className="mr-2" />
                            Limpar Filtros
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <WandSparkles className="mr-2" />
                            Surpreenda-me
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
