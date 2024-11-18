'use client'; // Ajoutez ce flag car vous utiliserez des hooks côté client
import Sidebar from "@/components/sidebar";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import { usePathname } from "next/navigation"; // Utilisez usePathname

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Récupère la route actuelle

  // Si l'utilisateur est sur /login, afficher uniquement le formulaire de connexion
  if (pathname === "/login") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // Sinon, protéger l'accès avec AuthGuard et afficher le Sidebar
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <Sidebar />
          <div className="ml-[266px] mt-[64px] p-5 max-md:ml-[100px]">
            {children}
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
