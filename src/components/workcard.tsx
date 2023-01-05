import {RouterOutputs, trpc} from '../utils/trpc';
import {Card, Pagination} from "flowbite-react"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WorkCard = ({work}: {work:RouterOutputs["degreeWork"]["listWorks"][number]}) => {
    return (
        <Link href="/trabajos/[id]" as={`/trabajos/${work.id}`} className="w-10/12 h-auto">
            <Card className="flex mb-2 rounded-none transform-gpu transition ease-in delay 100 hover:bg-gray-100">
                <div className='flex flex-row'>
                    <div className='flex flex-col items-start w-4/5'>
                        <p className='font-poppins font-medium'>{work.title}</p>
                        <p className='font-poppins font-thin text-sm'>Autores: {work.authors}</p>
                        <p className='font-poppins font-light'>{work.description.length > 100 ?
                        `${work.description.substring(0, 100)}...` : work.description
                    }</p>
                    </div>
                    <div className='w-1/5'>
                        <Image className="outline outline-gray-600 outline-1" src="/../public/imagentit.png" alt="imagen de portada" width={100} height={100}/>
                    </div>
                </div>
            </Card>
        </Link>
    );
}



const DegreeWorks = () => {
    const [take, setTake] = useState(7);
    const [skip, setSkip] = useState(0);
    const {data, status, isPreviousData} = trpc.degreeWork.listWorks.useQuery({
        take,
        skip,
    },{keepPreviousData: true});
    console.log(data);
    const currentPage = skip/7+1;
    const totalPages = (() : number => {
        if (data) {
            return Math.ceil(data.length/7);
        } else {
            return 0;
        }
    })();
    console.log(currentPage);
    console.log(totalPages);
    const onPageChange = () => {
        setTake(take + 7);
        setSkip(skip + 7);
    }
    return (
        <div className="flex flex-col justify-start items-center w-full h-full overflow-auto mb-2 pt-10">
            {data?.map((work) => (
                <WorkCard key={work.id} work={work}/>
            ))}
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>
            }
        </div>
    );
}
export default DegreeWorks;
