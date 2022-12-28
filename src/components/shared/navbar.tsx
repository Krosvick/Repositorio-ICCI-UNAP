import { FC, Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { HiBookOpen, HiX } from 'react-icons/hi'
import { signOut, useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import {Dropdown, Avatar} from "flowbite-react"

interface NavbarProps {}



const Navbar: FC<NavbarProps> = ({}) => {
  const { data: sessionData } = useSession()

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 drop-shadow-2xl">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
      <Link href="/" className='flex items-center'>
          <img src="https://i.imgur.com/agkobPn.png" className="h-6 mr-3 sm:h-9" alt="Unap Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Repositorio</span>
      </Link>
      {!sessionData && (
        <div className="flex md:order-2">
          <button
            onClick={sessionData ? () => signOut() : () => signIn('google')}
            className='outline outline-2 outline-emerald-600/50 text-black bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-poppins font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 h-10 drop-shadow-xl'>
            <svg className="mr-2 -ml-1 w-4 h-4" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"   fill="#4285f4" stroke="none"></path><path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34a853" stroke="none"></path><path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"   fill="#fbbc05" stroke="none"></path><path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#ea4335" stroke="none"></path></svg>
            Acceder con Google
          </button>

        </div>
      )} 
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
        <ul className="flex flex-col font-poppins font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center">
          <li>
            <Link href="/" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Inicio</Link>
          </li>
          <li>
            <Link href="/tags" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Tags</Link>
          </li>
          {sessionData && (
            <>
            <li>
              <Link href="/[userid]/favoritos" className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Favoritos</Link>
            </li>
            <Dropdown
              label={<img src={sessionData.user?.image ?? ""} referrerPolicy="no-referrer" className="w-10 h-10 rounded" alt="User" />}
              arrowIcon={false}
              inline={true}
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {sessionData.user?.name}
                </span>
                <span className="block truncate text-sm font-medium">
                  {sessionData.user?.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={() => signOut()}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown>
            </>
          )}
        </ul>
      </div>
      </div>
    </nav>

  )
}

export default Navbar