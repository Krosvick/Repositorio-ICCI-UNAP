import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  console.log(sessionData);

  return (
    <>
      <Head>
        <title>Repositorio Icci</title>
        <meta name="Repositoro Icci" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center h-[calc(100vh-6rem)]"> 
        {sessionData && (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-poppins mb-4">Bienvenido {sessionData.user?.name}</h1>
            <button type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
              <Link href="/degreeform">
                Post degreework
              </Link>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

