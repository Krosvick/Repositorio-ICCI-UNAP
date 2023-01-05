import { type NextPage } from "next"
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Error from "next/error";
import { Button, Card } from "flowbite-react"; 
import Image from "next/image";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Link from "next/link";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const detalle: NextPage = () => {

    const router = useRouter();
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    function onDocumentLoadSuccess({ numPages }:any) {
        setNumPages(numPages);
        setPageNumber(1);
    }
    function changePage(offset :any) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }
    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const postId = router.query.id as string;
    const {data, isLoading, isPreviousData} = trpc.degreeWork.getOne.useQuery({id: postId}, {keepPreviousData: true})
    if(isLoading) return <div>Loading...</div>
    if (!data) return <Error statusCode={404} />
    return(
        <div className="flex flex-col items-center justify-center pt-10">
            <Card className="w-3/5">
                <h1 className="font-poppins font-medium text-lg">{data.title}</h1>
                <p className="font-poppins font-extralight text-sm">Fecha de publicacion: {data.year}</p>
                <div className="flex">
                    <div>
                        <Document file={data.file}>
                            <Page pageNumber={1} renderMode="canvas" scale={0.2} renderAnnotationLayer={false} renderTextLayer={false}/>
                        </Document>
                        <Button>
                            <a href={data.file as string} download="test.pdf">
                                Descargar PDF
                            </a>
                        </Button>
                    </div>
                    <div className="flex flex-col pl-5 font-poppins">
                        <div className="flex justify-between"> 
                            <h3>Autores: {data.authors}</h3>
                            <h3 className="pl-5">Tipo: {data.type === "THESIS" ? "Tesis" : "Articulo"}</h3>
                        </div>
                        <h3 className="mb-1">Profesores ayudantes: {data.advisors}</h3>
                        <h3 className="mb-3">Abstracto</h3>
                        <div className="font-light mb-3">{data.description}</div>
                        <div className="flex gap-3">
                            <p>URI:</p>
                            <Link className="font-light text-blue-600 hover:text-blue-900" href={window.location.href}>{window.location.href}</Link>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="w-3/5 h-auto items-center">
                <Document file={data.file} className="documento" onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} scale={1} renderMode="canvas" loading="cargando" renderAnnotationLayer={false} renderTextLayer={false} />
                </Document>
                <div>
                    <p>Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}</p>
                    <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
                        Previous
                    </button>
                    <button type="button" disabled={pageNumber >= numPages} onClick={nextPage}>
                        Next
                    </button>
                </div>
            </Card>
        </div>
    )
}

export default detalle