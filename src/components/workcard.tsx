import {RouterOutputs, trpc} from '../utils/trpc';
import {Button, Card, Pagination, Spinner} from "flowbite-react"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Document, Page, pdfjs } from "react-pdf";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {motion} from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const WorkCard = ({work}: {work:RouterOutputs["degreeWork"]["listWorks"][number]}) => {
    const { data: sessionData } = useSession();
    return (
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}} transition={{duration: 0.3}} className="w-10/12 h-auto">
            <Link href="/trabajos/[id]" as={`/trabajos/${work.id}`}>
                <Card className="flex mb-2 rounded-none transform-gpu hover:bg-gray-100 transition duration-300 ease-in-out">
                    <div className='flex flex-row'>
                        <div className='flex flex-col items-start w-4/5'>
                            <p className='font-poppins font-medium'>{work.title}</p>
                            <p className='font-poppins font-thin text-sm'>Autores: {work.authors}</p>
                            <p className='font-poppins font-light text-justify'>{work.description.length > 200 ?
                            `${work.description.substring(0, 200)}...` : work.description
                        }</p>
                        {sessionData?.user?.role === "ADMIN" && 
                                <div className='flex justify-between w-full items-end'>
                                    <Button>
                                        <Link href="/edit/[id]" as={`/edit/${work.id}`}>
                                            Editar
                                        </Link>
                                    </Button>
                                    {work.deletedAt !== null &&
                                    <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Eliminado</span>
                                    }

                                </div>
                            }
                        </div>
                        <div className='w-1/5'>
                            <Document file={work.file}>
                                <Page pageNumber={1} renderMode="canvas" scale={0.18} renderAnnotationLayer={false} renderTextLayer={false}/>
                            </Document>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}



const DegreeWorks = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const [take, setTake] = useState(7);
    const [skip, setSkip] = useState(0);
    const {data:count} = trpc.degreeWork.count.useQuery();
    //wait for sessionData to be loaded
    //prevent this Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
    const {data, status, isPreviousData, isLoading, isSuccess} = trpc.degreeWork.listWorks.useQuery({
        take,
        skip: router.query.page ? (parseInt(router.query.page as string)-1)*7 : 0,
        isAdmin: sessionData?.user?.role === "ADMIN" ? true : false
    },{keepPreviousData: true});
    const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;
    const totalPages = (() : number => {
        if(count && data)
          if(data.length < take){
            return currentPage;
          }
            else{
                return Math.ceil(count/take);
            }
        return 0;   
    })();
    //if user tries to access a page that doesn't exist, redirect to last page using isSucces
    if(isSuccess && currentPage > totalPages){
        router.push(`/?page=${totalPages}`);
    }
    
    return (
        <div className="flex flex-col justify-start items-center w-full h-full mb-2 pt-10 gap-4">
            {isLoading && <Spinner aria-label="Extra large spinner example "size="xl"/>}
            {data?.map((work) => (
                <WorkCard {...parent} key={work.id} work={work}/>
            ))}
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} previousLabel="Anterior" nextLabel='Siguiente' onPageChange={(page) => {
                    setSkip((page-1)*7);
                    router.push(`/?page=${page}`);
                }
                }/>
            }
        </div>
    );
}
export default DegreeWorks;

