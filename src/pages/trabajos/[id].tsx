import { type NextPage } from "next"
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Error from "next/error";
import { Card } from "flowbite-react"; 
import Image from "next/image";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const detalle: NextPage = () => {
    const router = useRouter();
    const postId = router.query.id as string;
    const {data, isLoading, isPreviousData} = trpc.degreeWork.getOne.useQuery({id: postId}, {keepPreviousData: true})
    if(isLoading) return <div>Loading...</div>
    if (!data) return <Error statusCode={404} />
    return(
        <div className="flex items-center justify-center pt-10">
            <Card className="w-3/5">
                <h1 className="font-poppins font-medium text-lg">{data.title}</h1>
                <p className="font-poppins font-extralight text-sm">Fecha de publicacion: {data.year}</p>
                <div className="flex">
                    <div>
                        <Document file={data.file}>
                            <Page pageNumber={1} renderMode="canvas" scale={0.2} renderAnnotationLayer={false} renderTextLayer={false}/>
                        </Document>
                    </div>
                    <div className="flex flex-col pl-5">
                        <h3 className="mb-3">Abstracto</h3>
                        <div className="font-poppins font-light">{data.description}</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default detalle