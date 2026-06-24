'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Globe } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const { lang, toggleLang } = useLang();
  const router = useRouter();
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';
  const initials = session?.user?.name?.slice(0, 2).toUpperCase() ?? 'MN';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-14 items-center px-4 gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-orange-500 text-lg">
          <span className="text-2xl">🛕</span>
          <span>Moi Note</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">{t('dashboard', lang)}</Button>
          </Link>
          <Link href="/dashboard/functions">
            <Button variant="ghost" size="sm">{t('functions', lang)}</Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="sm">{t('reports', lang)}</Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-1 text-xs font-medium">
            <Globe className="h-4 w-4" />
            {lang.toUpperCase()}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            } />
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                {t('dashboard', lang)}
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-red-600"
              >
                {t('logout', lang)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
