
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPw, setShowPw] = useState(false)
	const [logged, setLogged] = useState(false)
	const [message, setMessage] = useState('')
	const [isError, setisError] = useState(false)
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		localStorage.setItem('token', 'osm')
		router.push("/")
		// try {
		// 	const response = await fetch(`/api/login`, {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		body: JSON.stringify({ email, password }),
		// 		credentials:'include'

		// 	})

		// 	if (response.ok) {
		// 		const data = await response.json();
		// 		localStorage.setItem('id', data.id)
		// 		localStorage.setItem('token', data.token)
		// 		localStorage.setItem('role', data.role)
		// 		localStorage.setItem('username', data.username)
		// 		localStorage.setItem('email', data.email)

		// 		// onLogin(token)
		// 		setLogged(true)
		// 	} else {
		// 		const data = await response.json()
		// 		setisError(true)
		// 		setMessage(data.error)

		// 	}
		// } catch (error) {
		// 	console.error('Network error:', error);
		// }
	}

	const toggleShow = () => {
		setShowPw(!showPw)
	}

	if (localStorage.getItem('token')) router.push('/')

	return (
		<div className='h-screen ' style={{
			backgroundImage: `url('/stock.png')`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
		}}>
			<div className='h-screen flex justify-center flex-col items-center'>
			<h1 className='text-white text-6xl font-extrabold' style={{ textShadow: '10px 2px px rgba(0,0,5, .5)' }}>GESTION DE STOCK</h1>
				<div
					className="flex flex-col gap-5 justify-center items-center p-5 h-3/6 lg:w-1/3 md:w-1/2" >
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
							{showPw && <FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />}
							{!showPw && <FaRegEyeSlash className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />}
						</div>
						<button className='btn btn-primary'>Login</button>
						{/* <NavLink to={'/forgot-password'} className="ml-auto underline text-blue-500">mot de passe oublié</NavLink> */}
						{isError && <p className='text-red-400'>{message}</p>}
					</form>
					{/* {isflash && <Flash color="red" message={message} onClose={onClose} />} */}
				</div>
			</div>
		</div>
	)
}
