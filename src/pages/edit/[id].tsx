import { type NextPage } from "next"
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Error from "next/error";
import { SubmitHandler, useForm } from "react-hook-form";
import {Label, TextInput, Select, Textarea, FileInput, ToggleSwitch, Button, Modal} from "flowbite-react";
import { z } from "zod";
import { DegreeWorkType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Fragment } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export const degreeFormAdminSchema = z.object({
        title: z.string().max(255),
        description: z.string().max(3000),
        type: z.enum([DegreeWorkType.THESIS, DegreeWorkType.ARTICLE]),
        authors: z.string().max(100),
        advisors: z.string().max(100),
        year: z.number().min(1900, {message: "el año debe ser mayor a 1900"}).max(2023, {message: "El año debe ser menor a 2023"}),
        file: z.any().nullable(),
        admissionDate: z.date().optional(),
        deletedAt: z.date().optional(),
    })

type degreeFormAdminSchema = z.infer<typeof degreeFormAdminSchema>;

const EditWork:NextPage = () => {
    const [admissionDate, setAdmissionDate] = useState<Date | undefined>(undefined);
    const [toggle, setToggle] = useState(false);
    const [file, setFile] = useState(false);
    const router = useRouter(); 
    const postId = router.query.id as string;
    const {mutateAsync: update} = trpc.degreeWork.update.useMutation();
    const {mutateAsync: deleteWork} = trpc.degreeWork.deleteOne.useMutation();
    const {mutateAsync: createSignedUrl} = trpc.degreeWork.getSignedUrl.useMutation();
    const {data, isLoading, isPreviousData, isError, isSuccess} = trpc.degreeWork.getOne.useQuery({id: postId}, {keepPreviousData: true})
    const {register, handleSubmit, formState:{errors}} = useForm<degreeFormAdminSchema>({
        resolver: zodResolver(degreeFormAdminSchema),
    });
    const onSubmit: SubmitHandler<degreeFormAdminSchema> = async (datas) => {
        if (file === false) {
            datas.file = data?.file
        }else{
            const {url, fields}: {url: string, fields: any} = await createSignedUrl({fileName: datas.file[0].name,dataType: datas.file[0].type}) as any;
            const datasx = {
                ...fields,
                'Content-Type': datas.file[0].type,
                file: datas.file[0],
            };
            const formData = new FormData();
            for (const name in datasx) {
                formData.append(name, datasx[name]);
            }
            await fetch(url, {
                method: 'POST',
                body: formData,
            });
            datas.file = url + "/" + datas.file[0].name;
        }
        await update({id: postId, data: {...datas, admissionDate}})
        router.push("/");
    }
    if (isError) return <Error statusCode={404} />
    if(isLoading) return <div>Loading...</div>
    console.log(errors)

    return(
        <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] overflow-auto">
            <div className="flex items-center pt-4">
                <h1 className="text-2xl font-poppins mb-4">Edita este trabajo</h1>
            </div>
            <div className="flex flex-col items-center w-full h-auto overflow-auto mb-2">
                <form className="flex flex-col gap-4 w-4/12" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="title"
                            value="Titulo"
                             />
                        </div>
                        <TextInput
                        id="title"
                        type="text"
                        placeholder="Ingrese el titulo"
                        defaultValue={data?.title}
                        {...register("title")}
                        />
                    {errors.title && (
                        <p className="text-xs italic text-red-500 mt-2"> {errors.title?.message}
                        </p>
                        )}
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="description"
                            value="Descripción"
                            />
                        </div>
                        <Textarea
                        id="description"
                        placeholder="Ingrese una descripción"
                        {...register("description")}
                        defaultValue={data?.description}
                        />
                    {errors.description && (
                        <p className="text-xs italic text-red-500 mt-2"> {errors.description?.message}
                        </p>
                        )}

                    </div>
                    <div id="select">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="type"
                                value="Tipo"
                            />
                        </div>
                        <Select
                            id="type"
                            {...register("type")}
                            defaultValue={data?.type}
                        >
                            <option value={"THESIS"}>
                                Tesis
                            </option>
                            <option value={"ARTICLE"}>
                                Artículo
                            </option>
                        </Select>
                    {errors.type && (
                        <p className="text-xs italic text-red-500 mt-2"> {errors.type?.message}
                        </p>
                        )}
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="authors"
                            value="Autores"
                             />
                        </div>
                        <TextInput
                        id="authors"
                        type="text"
                        placeholder="Autores"
                        {...register("authors")}
                        defaultValue={data?.authors}
                        />
                        {errors.authors && (
                            <p className="text-xs italic text-red-500 mt-2"> {errors.authors?.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="Profesores"
                            value="Profesores ayudantes"
                             />
                        </div>
                        <TextInput
                        id="Profesores"
                        type="text"
                        placeholder="Profesores ayudantes"
                        {...register("advisors")}
                        defaultValue={data?.advisors}
                        />
                        {errors.advisors && (
                            <p className="text-xs italic text-red-500 mt-2"> {errors.advisors?.message}
                            </p>
                        )}

                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="year"
                            value="Año de publicación"
                             />
                        </div>
                        <TextInput
                        id="year"
                        type="number"
                        placeholder="Ingrese el año de publicación"
                        {...register("year", {valueAsNumber: true})}
                        defaultValue={data?.year}
                        />
                        {errors.year && (
                        <p className="text-xs italic text-red-500 mt-2"> {errors.year?.message}
                        </p>
                        )}
                    </div>
                    <div id="fileUpload">
                        <div className="mb-2 block">
                            <Label
                            htmlFor="file"
                            value="Subir archivo"
                            />
                        </div>
                        <FileInput
                            id="file"
                            helperText="Seleccione un nuevo archivo para reemplazar el anterior, solo se permiten archivos pdf"
                            required={false}
                            //if left empty, set file to false
                            //else set file to true
                            onChange={(e) => {
                                if (e.target.files,length > 0) {
                                    setFile(true);
                                } else {
                                    setFile(false);
                                }
                            }}
                        />
                    </div>
                    <div className="flex justify-between">
                        <ToggleSwitch
                            id="toogle"
                            className="mt-4"
                            //checked if admissionDate is not undefined, else assign toggle is false
                            checked={data?.admisionDate ? true : toggle}
                            label="Aprobar trabajo"
                            onChange={(e) => {
                                if (e.valueOf()) {
                                    setToggle(true);
                                    setAdmissionDate(new Date());
                                } else {
                                    setToggle(false);
                                    setAdmissionDate(undefined);
                                }
                            }}
                        />
                        <Button color="failure" onClick={
                            async () => {
                                await deleteWork({id: postId})
                                router.push("/")
                            }
                        }>
                            Eliminar trabajo
                        </Button>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                        Actualizar
                    </button>
                </form>
            </div>
        </div>
    )
}


export default EditWork;
export async function getServerSideProps(context: CreateNextContextOptions) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );
    if(session?.user?.role !== "ADMIN"){
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }else {
        return {props:{}};
    }

}