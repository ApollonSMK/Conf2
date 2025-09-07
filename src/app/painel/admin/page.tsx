
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/painel/admin/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>A redirecionar para o painel de administração...</p>
      </div>
    </div>
  );
}
