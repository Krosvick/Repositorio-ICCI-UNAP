import {RouterOutputs, trpc} from '../utils/trpc';
import {Card, Pagination} from "flowbite-react"
import { useState } from 'react';

const WorkCard = ({work}: {work:RouterOutputs["degreeWork"]["listWorks"][number]}) => {
    return (
        <Card className="w-5/12 h-auto mb-2 rounded-none">
            <div className='flex flex-col items-center'>
                <p className='font-poppins'>{work.title}</p>

            </div>
        </Card>
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
