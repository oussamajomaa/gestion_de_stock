'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type AuthGuardProps = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // État initial
    const router = useRouter();
    const pathname = usePathname(); // Récupérer la route actuelle

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (pathname === '/login') {
                setIsAuthenticated(null); // Pas de vérification sur /login
                return;
            }

            if (!token) {
                setIsAuthenticated(false);
                router.replace('/login'); // Remplace plutôt que push pour éviter un historique inutile
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [pathname, router]);

    if (isAuthenticated === null && pathname !== '/login') {
        // Afficher un spinner pendant la vérification
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // Si utilisateur non authentifié et pas sur /login, ne rien afficher
    if (isAuthenticated === false) {
        return null; // Pas d'affichage si non connecté
    }

    return <>{children}</>; // Afficher les enfants si authentifié
}
