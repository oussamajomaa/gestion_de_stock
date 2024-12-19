'use client'

import { useState } from "react"
import { IoAdd } from "react-icons/io5"

export default function page() {
	const [search,setSearch] = useState('')

	const handlSearch = async () => {

	}

	const handleAdd  =async () => {

	}
    return (
      <div className="">
			<div className="flex justify-between items-center mb-3 max-lg:items-start">
				<div className="flex items-center gap-6 w-5/6 max-lg:flex-col max-lg:w-full max-lg:items-start">
					<h1 className="text-2xl font-bold">Liste des Recettes</h1>
					<div className=" flex items-center gap-3">
						<input type="text" placeholder="chercher par nom de recette..." className="input input-bordered w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
						<button className="btn" onClick={handlSearch}>X</button>
					</div>
				</div>
				<button className="rounded-md p-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleAdd}><IoAdd size={24} /></button>
			</div>
    </div>
    )
  }