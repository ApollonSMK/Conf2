
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Home, LogOut, Newspaper, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { href: '/painel', label: 'Início', icon: Home },
    { href: '/painel/descobertas', label: 'Descobertas', icon: BookOpen, disabled: true },
    { href: '/painel/definicoes', label: 'Definições', icon: Settings, disabled: true },
    { href: '/painel/admin', label: 'Admin', icon: Shield, disabled: false },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://picsum.photos/100/100" alt="Avatar do Utilizador" data-ai-hint="user avatar"/>
                    <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold truncate text-foreground">António Costa</p>
                    <p className="text-xs truncate text-muted-foreground">Confrade Fundador</p>
                </div>
            </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        disabled={item.disabled}
                        tooltip={{children: item.label}}
                    >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{children: 'Terminar Sessão'}}>
                        <LogOut />
                        <span>Terminar Sessão</span>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
            <h1 className="text-lg font-medium text-foreground">Painel</h1>
            <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
