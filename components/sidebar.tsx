'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { TfiPanel } from 'react-icons/tfi';
import { MdOutlineInventory } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { FcExpired } from 'react-icons/fc';
import { FaUsers } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { TbReportAnalytics } from 'react-icons/tb';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserRole(localStorage.getItem('role'));
            setUserEmail(localStorage.getItem('email'));
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const getLinkClass = (path: string) =>
        pathname === path ? 'text-yellow-300' : 'text-white';
    return (
        <>
            <div className="h-16 bg-[#C3A348] flex justify-between items-center p-5 fixed top-0 w-full">
                <h1 className="text-3xl font-bold max-md:text-[16px]">GESTION DE STOCK</h1>
                <div>
                    <h2 className=" font-medium max-md:text-[12px]">{localStorage.getItem('email')}</h2>
                    <h2 className=" font-medium max-md:text-[12px]">Rôle: {localStorage.getItem('role')}</h2>
                </div>
            </div>
            <aside className="w-[266px] h-screen-minus-64 fixed top-[64px] bg-[#192340] p-3 flex flex-col justify-between text-white max-md:w-[100px] transition-all duration-300 ease-in-out">
                <nav className="flex flex-col gap-6 pt-10 max-md:hidden">
                    <Link href="/" className={`flex items-center gap-3 ${getLinkClass("/")}`}>
                        <TfiPanel size={24}/> Tableau de bord
                    </Link>
                    <Link href="/article" className={`flex items-center gap-3 ${getLinkClass("/article")}`}>
                        <MdOutlineInventory size={24}/> Gestion d'inventaire
                    </Link>
                    <Link href="/transaction" className={`flex items-center gap-3 ${getLinkClass("/transaction")}`}>
                        <GrTransaction size={24}/> Gestion de transaction
                    </Link>
                    <Link href="/peremption" className={`flex items-center gap-3 ${getLinkClass("/peremption")}`}>
                        <FcExpired size={24}/> Gestion date de péremption
                    </Link>
                    {/* <Link href="/recette" className={`flex items-center gap-3 ${getLinkClass("/recette")}`}>
                        <MdFastfood size={24}/> Gestion de recette
                    </Link> */}
                    {/* <Link href="/rapport" className={`flex items-center gap-3 ${getLinkClass("/rapport")}`}>
                        <TbReportAnalytics size={24}/> Génération des rapports
                    </Link> */}
                    {localStorage.getItem('role')=== 'admin' && <Link href="/user" className={`flex items-center gap-3 ${getLinkClass("/user")}`}>
                        <FaUsers size={24}/> Gestion des utilisateurs
                    </Link>}  
                </nav>
                <nav className="flex flex-col items-center gap-6 pt-10 md:hidden md:bg-slate-200 transition-transform duration-300 ease-in-out transform hover:scale-105">
                    <Link href="/" className={getLinkClass("/")}><TfiPanel size={40}/></Link>
                    <Link href="/article" className={getLinkClass("/article")}><MdOutlineInventory size={40}/></Link>
                    <Link href="/transaction" className={getLinkClass("/transaction")}><GrTransaction size={40}/></Link>
                    <Link href="/peremption" className={getLinkClass("/peremption")}><FcExpired size={40}/></Link>
                    {/* <Link href="/recette" className={getLinkClass("/recette")}><MdFastfood size={40}/></Link> */}
                    <Link href="/rapport" className={getLinkClass("/rapport")}><TbReportAnalytics size={40}/></Link>
                    <Link href="/user" className={getLinkClass("/user")}><FaUsers size={40}/></Link>  
                </nav>

                <div className="flex justify-center">
                    <button className="btn btn-outline text-white max-md:hidden" onClick={logout}>Déconnexion</button>
                    <button className="md:hidden p-1 rounded-2xl text-white" onClick={logout}><IoMdLogOut size={40} /></button>
                </div>
            </aside>
        </>
    );
}
