
export default function page() {
	return (
		<div className="grid grid-cols-2 gap-5">
			<div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
				<h2 className='text-6xl '>{ }</h2>
				<h2 className='text-xl '>Liste d'articles</h2>
				<button className="btn btn-warning font-bold py-2 px-4 rounded">
					Exporter en CSV
				</button>
			</div>
			<div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
				<h2 className='text-6xl '>{ }</h2>
				<h2 className='text-xl '>Liste d'articles</h2>
				<button className="btn btn-warning font-bold py-2 px-4 rounded">
					Exporter en CSV
				</button>
			</div>
			<div className='h-72 w-72 bg-slate-400 rounded flex flex-col justify-center items-center text-white gap-5'>
				<h2 className='text-6xl '>{ }</h2>
				<h2 className='text-xl '>Liste d'articles</h2>
				<button className="btn btn-warning font-bold py-2 px-4 rounded">
					Exporter en CSV
				</button>
			</div>
		</div>
	)
}
