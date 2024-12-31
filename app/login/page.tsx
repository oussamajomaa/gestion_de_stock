'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPw, setShowPw] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false); // Empêche un rendu inutile
	const router = useRouter();

	// Vérification du token dans localStorage
	useEffect(() => {
		if (typeof window !== 'undefined' && localStorage.getItem('token')) {
			router.push('/');
		}
	}, [router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			if (response.ok) {
				localStorage.setItem('id', data.id);
				localStorage.setItem('token', data.token);
				localStorage.setItem('role', data.role);
				localStorage.setItem('email', data.email);
				router.push('/');
			} else {
				Swal.fire('', data.message, data.icon);
			}
		} catch (error) {
			console.error('Network error:', error);
		}
	};

	const toggleShow = () => {
		setShowPw(!showPw);
	};

	if (isRedirecting) return null; // Empêche le double rendu si déjà redirigé

	return (
		<div className='h-screen' style={{
			backgroundImage: `url('/stock.png')`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}}>
			<div className='h-screen flex justify-center flex-col items-center'>
				<h1 className='text-white text-6xl font-extrabold' style={{ textShadow: '10px 2px rgba(0,0,5, .5)' }}>GESTION DE STOCK</h1>
				<div
					className="flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2">
					<h2 className='text-2xl font-bold text-white'>CONNEXION</h2>
					<form onSubmit={handleLogin} className="flex flex-col gap-5 w-[400px] px-3">
						<input
							className='input input-bordered input-primary w-full'
							type="text"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="E-mail" />
						<div className='relative'>
							<input
								className='input input-bordered input-primary w-full'
								type={showPw ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Mot de passe" />
							{showPw ? (
								<FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />
							) : (
								<FaRegEyeSlash className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />
							)}
						</div>
						<button className='btn btn-primary'>Login</button>
					</form>
				</div>
			</div>
		</div>
	);
}
