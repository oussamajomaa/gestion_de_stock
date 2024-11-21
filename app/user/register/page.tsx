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
	const [usernameUpdate, setUsernameUpdate] = useState('')
	const [emailUpdate, setEmailUpdate] = useState('')
	const [roleUpdate, setRoleUpdate] = useState('')
	const [idUpdate, setIdUpdate] = useState(0)
	const [users, setUsers] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter()
	// const fetchUser = async () => {
	// 	setIsLoading(true)
	// 	const response = await fetch('/api/register', {
	// 		credentials: 'include'
	// 	})

	// 	if (response.status === 401) {
	// 		setIs401(true)
	// 		// navigate('/login')
	// 	} else if (response.ok) {
	// 		const data = await response.json()
	// 		setUsers(data)
	// 	}
	// 	setIsLoading(false)
	// }

	// useEffect(() => {
	// 	fetchUser()
	// }, [])

	const handleAddUser = async (e:FormEvent) => {
		e.preventDefault()
		try {
			const response = await fetch('/api/user/register', {
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


	// const handleDelete = (id) => {
	// 	setIsDeleteModal(true)
	// 	const [user] = users.filter(user => {
	// 		return user.id === id
	// 	})
	// 	localStorage.setItem('user', user.email)
	// 	localStorage.setItem('deletUserId', id)
	// };

	// const submitDelete = async () => {
	// 	const id = localStorage.getItem('deletUserId')
	// 	const response = await fetch(`${ENDPOINT}/user/delete/${id}`, {
	// 		credentials: 'include'
	// 	})

	// 	if (response.ok) {
	// 		const data = await response.json()
	// 		fetchUser()
	// 		setIsDeleteModal(false)
	// 	}
	// }

	// const handleEdit = async (id) => {
	// 	setIdUpdate(id)
	// 	const response = await fetch(`${ENDPOINT}/user/${id}`, {
	// 		credentials: 'include'
	// 	})
	// 	if (response.ok) {
	// 		const data = await response.json()
	// 		setEmailUpdate(data.email)
	// 		setUsernameUpdate(data.username)
	// 		setRoleUpdate(data.role)
	// 		setIsMessage(false)
	// 	}
	// 	setIsOpenUpdate(true)
	// }

	// const closeModal = () => {
	// 	setIsOpen(false);
	// 	setIsOpenUpdate(false)
	// 	setUsername('')
	// 	setEmail('')
	// 	setPassword('')
	// 	setRole('')
	// };

	// const onCloseDeleteModal = () => {
	// 	setIsDeleteModal(false)
	// }

	// const onClose401 = () => {
	// 	setIs401(false)
	// 	navigate('/login')
	// }

	// const handleUpdate = async (e) => {
	// 	e.preventDefault()

	// 	const response = await fetch(`${ENDPOINT}/user/update/${idUpdate}`, {
	// 		method: 'PUT',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ usernameUpdate, roleUpdate }),
	// 		credentials: 'include'
	// 	})
	// 	if (response.ok) {
	// 		const data = await response.json()
	// 		setIsOpenUpdate(false)
	// 		fetchUser()
	// 	} else {
	// 		setIsMessage(true)
	// 	}
	// }

	const toggleShow = () => {
		setShowPw(!showPw)
	}

	if (localStorage.getItem('role') !== 'admin') {
		Swal.fire('', "Vous n'ếtes pas autorisé d....", 'error');
		return
	}
	return (
		<div className="xl:ml-64 max-xl:ml-24 ">
			
			{isLoading && <span className="loading loading-bars loading-lg text-accent block m-auto"></span>}
			



			
				<div className=' flex justify-center items-center  '>
					<div className='flex flex-col gap-5 justify-center items-center  w-full'>
						<h2 className='text-2xl font-bold'>Ajouter un utilisateur</h2>
						<form onSubmit={handleAddUser} className="flex flex-col gap-5 w-1/2 max-md:w-full">
							
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
							<select className="select select-bordered select-primary w-full" defaultValue={'DEFAULT'}
								onChange={(e) => setRole(e.target.value)}>
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

