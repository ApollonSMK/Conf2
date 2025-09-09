
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Home, LogOut, Newspaper, Settings, Shield, Users, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { href: '/painel/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/painel/admin/users', label: 'Utilizadores', icon: Users, disabled: false },
    { href: '/painel/admin/discoveries', label: 'Descobertas', icon: BookOpen, disabled: false },
    { href: '/painel/admin/confrarias', label: 'Confrarias', icon: UtensilsCrossed, disabled: false },
    { href: '/painel/admin/settings', label: 'Definições', icon: Settings, disabled: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
                 <div className="bg-primary/10 p-2 rounded-lg">
                     <Shield className="h-8 w-8 text-primary" />
                 </div>
                <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold truncate text-foreground">Painel Admin</p>
                    <p className="text-xs truncate text-muted-foreground">Gestão da Plataforma</p>
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
                        isActive={pathname === item.href || (item.href !== '/painel/admin/dashboard' && pathname.startsWith(item.href))}
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
                    <SidebarMenuButton tooltip={{children: 'Voltar ao Site'}}>
                         <Link href="/" className='w-full'>
                            <LogOut />
                            <span>Voltar ao Site</span>
                        </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* Remove the mobile header to make the edit page feel standalone */}
        {pathname.includes('/painel/admin/confrarias/editar') ? null : (
             <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
                <h1 className="text-lg font-medium text-foreground">Painel Admin</h1>
                <SidebarTrigger />
            </header>
        )}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
