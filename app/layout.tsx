'use client';
import Sidebar from '@/components/sidebar';
import './globals.css';
import AuthGuard from '@/components/AuthGuard';
import { usePathname } from 'next/navigation';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    if (pathname === '/login') {
        return (
            <html lang="en">
                <body>{children}</body>
            </html>
        );
    }

    return (
        <html lang="en">
            <body>
                <AuthGuard>
                    <Sidebar />
                    <div className="ml-[266px] mt-[64px] p-5 max-md:ml-[100px]">{children}</div>
                </AuthGuard>
            </body>
        </html>
    );
}
