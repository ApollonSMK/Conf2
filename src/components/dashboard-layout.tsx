
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
import { Separator } from '@/components/ui/separator';
import { BookOpen, Home, LogOut, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

const baseMenuItems = [
    { href: '/painel', label: 'Início', icon: Home, adminOnly: false },
    { href: '/painel/descobertas', label: 'Descobertas', icon: BookOpen, disabled: false, adminOnly: false },
    { href: '/painel/definicoes', label: 'Definições', icon: Settings, disabled: true, adminOnly: false },
];

const adminMenuItem = { href: '/painel/admin/dashboard', label: 'Admin', icon: Shield, disabled: false, adminOnly: true };


export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const auth = getAuth();
    const [user, setUser] = React.useState<User | null>(null);
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserRole(userDocSnap.data().role);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);
    
    const menuItems = userRole === 'Admin' ? [...baseMenuItems, adminMenuItem] : baseMenuItems;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.photoURL ?? "https://picsum.photos/100/100"} alt="Avatar do Utilizador" data-ai-hint="user avatar"/>
                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                    {loading ? (
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ) : (
                        <>
                         <p className="font-semibold truncate text-foreground">{user?.displayName ?? 'Confrade'}</p>
                         <p className="text-xs truncate text-muted-foreground">{userRole ?? 'Confrade'}</p>
                        </>
                    )}
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
