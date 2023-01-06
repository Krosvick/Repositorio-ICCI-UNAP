import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { TextInput, Label, Select, Button, FileInput, Textarea } from "flowbite-react";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import { DegreeWorkType } from "@prisma/client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react"
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { useRouter } from "next/router";


export const degreeformSchema = z.object({
        title: z.string().max(255),
        description: z.string().max(3000),
        //type is an enum in prisma
        type: z.enum([DegreeWorkType.THESIS, DegreeWorkType.ARTICLE]),
        authors: z.string().max(100),
        advisors: z.string().max(100),
        year: z.number().min(1900).max(2100),
        file: z.any(),
    })

type degreeformSchema = z.infer<typeof degreeformSchema>;

const Degreeform: NextPage = () => {
    const utils = trpc.useContext();
    const router = useRouter();
    const {data: sessionData} = useSession();
    const {mutateAsync: addDegreeWork} = trpc.degreeWork.publish.useMutation();
    const {mutateAsync: createSignedUrl} = trpc.degreeWork.getSignedUrl.useMutation();
    
    const {register, handleSubmit, formState:{errors}} = useForm<degreeformSchema>({
        resolver: zodResolver(degreeformSchema),
    });
    const onSubmit: SubmitHandler<degreeformSchema> = async (data) => {
        const {url, fields}: {url: string, fields: any} = await createSignedUrl({fileName: data.file[0].name}) as any;
        const datas = {
            ...fields,
            'Content-Type': data.file[0].type,
            file: data.file[0],
        };
        const formData = new FormData();
        for (const name in datas) {
            formData.append(name, datas[name]);
        }
        await fetch(url, {
            method: 'POST',
            body: formData,
        });
        data.file = url + "/" + data.file[0].name;
        await addDegreeWork(data);
        router.push("/");
    }
    
    return (
        //this will be a form to post a degree work in the middle of the page
        //style with tailwind
        <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] overflow-auto">
            <div className="flex items-center pt-4">
                <h1 className="text-2xl font-poppins mb-4">Publica tu trabajo</h1>
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
                        required={true}
                        {...register("title")}
                        />
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
                        required={true}
                        placeholder="Ingrese una descripción"
                        {...register("description")}
                        />
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
                            required={true}
                            {...register("type")}
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
                        required={true}
                        {...register("authors")}
                        />
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
                        required={true}
                        {...register("advisors")}
                        />
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
                        required={true}
                        {...register("year", {valueAsNumber: true})}
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
                            helperText="Solo se permiten archivos pdf"
                            required={true}
                            accept=".pdf"
                            {...register("file")}
                        />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                        Enviar
                    </button>
                    
                    </form>
                </div>
            </div>
    )
}
export default Degreeform;

export async function getServerSideProps(context: CreateNextContextOptions) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );
    if(!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }else if(session?.user?.emVerified === false) {
        return {
            redirect: {
                destination: "/verify",
                permanent: false,
            }
        }
    }else {
        return {props:{}};
    }
}