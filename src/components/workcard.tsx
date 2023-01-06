import {RouterOutputs, trpc} from '../utils/trpc';
import {Button, Card, Pagination, Spinner} from "flowbite-react"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Document, Page, pdfjs } from "react-pdf";
import { useSession } from 'next-auth/react';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const WorkCard = ({work}: {work:RouterOutputs["degreeWork"]["listWorks"][number]}) => {
    const { data: sessionData } = useSession();
    return (
        <Link href="/trabajos/[id]" as={`/trabajos/${work.id}`} className="w-10/12 h-auto">
            <Card className="flex mb-2 rounded-none transform-gpu transition ease-in delay 100 hover:bg-gray-100">
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
    );
}



const DegreeWorks = () => {
    const { data: sessionData } = useSession();
    const [take, setTake] = useState(7);
    const [skip, setSkip] = useState(0);
    const {data:count} = trpc.degreeWork.count.useQuery();
    //wait for sessionData to be loaded
    //prevent this Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
    const {data, status, isPreviousData, isLoading} = trpc.degreeWork.listWorks.useQuery({
        take,
        skip,
        isAdmin: sessionData?.user?.role === "ADMIN" ? true : false
    },{keepPreviousData: true});
    const currentPage = skip/7 + 1;
    const totalPages = (() : number => {
        if (count && data) {
            if (data?.length < 7) {
                return 1;
            }
            else {
                return Math.floor(count/7) + 1;
            }
        }
        return 0
        })();
        console.log("pg totales:" + totalPages)
    return (
        <div className="flex flex-col justify-start items-center w-full h-full overflow-auto mb-2 pt-10">
            {data?.map((work) => (
                <WorkCard key={work.id} work={work}/>
            ))}
            {isLoading && <Spinner aria-label="Extra large spinner example "size="xl"/>}
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => {
                    setSkip((page-1)*7);
                }
                }/>
            }
        </div>
    );
}
export default DegreeWorks;

