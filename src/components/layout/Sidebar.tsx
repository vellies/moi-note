'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLang } from '@/contexts/LangContext';
import { t } from '@/lib/i18n';
import { LayoutDashboard, List, BarChart2, Users, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';

const navItems = [
  { href: '/dashboard', label: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/dashboard/functions', label: 'functions' as const, icon: List },
  { href: '/dashboard/reports', label: 'reports' as const, icon: BarChart2 },
];

const adminItems = [
  { href: '/admin', label: 'Admin', icon: Settings },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { lang } = useLang();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r bg-gray-50 py-6 px-3">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.label, lang)}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin
            </div>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
