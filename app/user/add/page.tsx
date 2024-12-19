'use client'
import { useRouter } from "next/navigation";
import { FormEvent, useState, } from "react"
import { FaRegEye } from "react-icons/fa6";
import Swal from 'sweetalert2';


export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPw, setShowPw] = useState(false)
	const [role, setRole] = useState('')
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter()

	const handleAddUser = async (e: FormEvent) => {
		e.preventDefault()
		try {
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, role }),
			})

			const data = await response.json();
			if (response.ok) {
				setEmail('')
				setPassword('')
				setRole('')
				router.push('/user')
			}
			Swal.fire('', data.message, data.icon);
		} catch (error) {
			console.error('Network error:', error);
		}
	}


	const toggleShow = () => {
		setShowPw(!showPw)
	}

	if (localStorage.getItem('role') !== 'admin') {
		Swal.fire('', "Vous n'ếtes pas autorisé d....", 'error');
		return
	}
	return (
		<div className=" ">
			{isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
			<div className="p-5 shadow-2xl w-[500px] m-auto rounded-md">

				<div className='flex flex-col gap-5 justify-center items-center  '>
					<h2 className='text-2xl font-bold'>Ajouter un utilisateur</h2>
					<form onSubmit={handleAddUser} className="flex flex-col gap-5 w-[400px]">

						<input
							className='input input-bordered input-primary w-full '
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="E-mail" />
						<div className="relative">
							<input
								className='input input-bordered input-primary w-full '
								type={showPw ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Mot de passe" />
							<FaRegEye className="absolute top-4 right-5 cursor-pointer" onClick={toggleShow} />

						</div>
						<select
							className="select select-bordered select-primary w-full"
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							<option value="DEFAULT" disabled>Choisir un rôle</option>
							<option value="admin">Administrateur</option>
							{/* <option value="Validateur">Validateur</option> */}
							<option value="user">Utilisateur</option>
						</select>
						<button className='btn btn-primary'>Valider</button>
					</form>
				</div>
			</div>
		</div>
	)
}

