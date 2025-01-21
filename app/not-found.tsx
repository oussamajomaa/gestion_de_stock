import Link from "next/link";

export default function NotFound() {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg">La page que vous cherchez n&apos;existe pas.</p>
        <Link href="/" className="mt-5 text-blue-500 underline">Retourner à la page d&apos;accueil</Link>
      </div>
    );
  }