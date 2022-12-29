import { NextPage } from 'next'
import { TextInput, Button } from 'flowbite-react'
import {SubmitHandler, useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import { trpc } from '../utils/trpc';
import { useState } from 'react';


const emailSchema = z.object({
    email: z.string().regex(/@estudiantesunap.cl$/),
}) 
type emailSchema = z.infer<typeof emailSchema>;

const verificationSchema = z.object({
    code: z.string().min(6).max(6),
})
type verificationSchema = z.infer<typeof verificationSchema>;

const emailverification: NextPage = () => {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const utils = trpc.useContext();
        //the idea of this is to store the email when the user submits the form
        //then hide the email input and show a text input to enter the verification code
        //and then check if the verification code is correct
    const {register, handleSubmit, formState:{errors}} = useForm<emailSchema>({
        resolver: zodResolver(emailSchema),
    });
    const {register: register2, handleSubmit: handleSubmit2, formState:{errors: errors2}} = useForm<verificationSchema>({
        resolver: zodResolver(verificationSchema),
    });
    const onSubmit: SubmitHandler<emailSchema> = async (data) => {
        setEmail(data.email);
        
    }
    const verifyCode: SubmitHandler<verificationSchema> = async (data) => {
    }
    return (
        //simple centered div with an email input and a button to send the email with tailwindcss
        <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-2xl font-poppins mb-4">Verifica tu correo</h1>
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="Ingrese su correo institucional"
                        required={true}
                        sizing="lg"
                        {...register("email",{
                            required: "Este campo es requerido",
                            pattern: {
                                value: /@estudiantesunap.cl$/,
                                message: "Ingrese un correo institucional válido",
                            }
                        })}
                    />
                    {errors && (
                        console.log(errors),
                        <p className="text-red-500">{errors.email?.message}</p>
                    )}  
                    <Button
                        type="submit"
                    >
                        Enviar correo
                    </Button>
                </form>
                {email && (
                    //centered div with a text input and a button to verify the code
                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-2xl font-poppins mb-4">Ingresa el código de verificación</h1>
                        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit2(verifyCode)}>
                            <TextInput
                                id="code"
                                type="text"
                                placeholder="Ingrese el código de verificación"
                                required={true}
                                sizing="lg"
                                {...register2("code")}
                            />
                            <Button
                                type="submit"
                            >
                                Verificar
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>

    ) 
}

export default emailverification