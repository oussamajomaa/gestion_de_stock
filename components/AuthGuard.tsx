'use client'
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = état initial
    const router = useRouter();
    const pathname = usePathname(); // Vérifier la route actuelle

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            // Si la route est /login, ne pas appliquer AuthGuard
            if (pathname === "/login") {
                setIsAuthenticated(null); // Ne pas gérer l'authentification sur /login
                return;
            }

            // Vérifier si l'utilisateur est authentifié
            if (!token) {
                setIsAuthenticated(false);
                router.push("/login"); // Rediriger vers /login si non connecté
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [router, pathname]);

    // Afficher un spinner pendant la vérification
    if (isAuthenticated === null && pathname !== "/login") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // Si utilisateur non authentifié et pas sur /login, ne rien afficher
    if (!isAuthenticated && pathname !== "/login") {
        return null;
    }

    // Rendre les enfants si authentifié
    return <>{children}</>;
}
