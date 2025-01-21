// Activation du mode "use client" pour ce composant React
'use client';

// Importation des hooks React pour gérer l'état et les effets secondaires
import { useState, useEffect } from 'react';

// Importation de Next.js pour gérer la navigation
import { useRouter } from "next/navigation";

// Importation des icônes pour afficher ou masquer le mot de passe
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";

// Importation de SweetAlert2 pour afficher des alertes utilisateur
import Swal from 'sweetalert2';

// Composant principal de la page de connexion
export default function Login() {
    // États pour gérer les champs de formulaire et les options d'affichage
    const [email, setEmail] = useState(''); // Email de l'utilisateur
    const [password, setPassword] = useState(''); // Mot de passe de l'utilisateur
    const [showPw, setShowPw] = useState(false); // Indicateur pour afficher/masquer le mot de passe
    const router = useRouter(); // Gestionnaire de navigation

    // Effet pour vérifier si un utilisateur est déjà connecté via un token dans localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            router.push('/'); // Redirection vers la page d'accueil si un token est présent
        }
    }, [router]);

    // Fonction pour gérer la soumission du formulaire de connexion
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
        try {
            // Appel de l'API pour vérifier les informations de connexion
            const response = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Envoi des données de connexion
            });

            const data = await response.json(); // Récupération des données de réponse
            if (response.ok) {
                // Stockage des informations utilisateur dans localStorage
                localStorage.setItem('id', data.id);
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', data.email);
                router.push('/'); // Redirection vers la page d'accueil
            } else {
                // Affichage d'une alerte en cas d'échec
                Swal.fire('', data.message, data.icon);
            }
        } catch (error) {
            console.error('Network error:', error); // Gestion des erreurs réseau
        }
    };

    // Fonction pour basculer l'affichage du mot de passe
    const toggleShow = () => {
        setShowPw(!showPw); // Inverse l'état de visibilité du mot de passe
    };

    // Rendu du composant
    return (
        <div className='h-screen' style={{
            backgroundImage: `url('/stock.png')`, // Image d'arrière-plan
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div className='h-screen flex justify-center flex-col items-center'>
                {/* Titre principal */}
                <h1 className='text-white text-6xl font-extrabold' style={{ textShadow: '10px 2px rgba(0,0,5, .5)' }}>GESTION DE STOCK</h1>
                <div
                    className="flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2">
                    <h2 className='text-2xl font-bold text-white'>CONNEXION</h2>

                    {/* Formulaire de connexion */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-5 w-[400px] px-3">
                        {/* Champ pour l'email */}
                        <input
                            className='input input-bordered input-primary w-full'
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail" />

                        {/* Champ pour le mot de passe avec affichage/masquage */}
                        <div className='relative'>
                            <input
                                className='input input-bordered input-primary w-full'
                                type={showPw ? "text" : "password"} // Type en fonction de l'état `showPw`
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe" />
                            {showPw ? (
                                // Icône pour masquer le mot de passe
                                <FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />
                            ) : (
                                // Icône pour afficher le mot de passe
                                <FaRegEyeSlash className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />
                            )}
                        </div>

                        {/* Bouton de soumission */}
                        <button className='btn btn-primary'>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
