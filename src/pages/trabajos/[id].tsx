import { type NextPage } from "next"
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Error from "next/error";
import { Card } from "flowbite-react"; 



const detalle: NextPage = () => {
    const router = useRouter();
    const postId = router.query.id as string;
    const {data, isLoading, isPreviousData} = trpc.degreeWork.getOne.useQuery({id: postId}, {keepPreviousData: true})
    if(isLoading) return <div>Loading...</div>
    if (!data) return <Error statusCode={404} />
    return(
        <div className="flex items-center justify-center">
            <Card className="w-3/5">
                <h1>{data.title}</h1>
                <p>{data.description}</p>
            </Card>
        </div>
    )
}

export default detalle