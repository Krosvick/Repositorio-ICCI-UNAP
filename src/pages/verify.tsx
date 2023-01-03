import { NextPage } from 'next'
import { TextInput, Button } from 'flowbite-react'
import {SubmitHandler, useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import { trpc } from '../utils/trpc';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Mailform from '../components/shared/mailform';
import Message from '../components/shared/confirmation';


export const mailSchema = z.object({
    email: z.string().regex(/@estudiantesunap.cl$/,{message: "Por favor, ingrese un correo institucional"})
}) 
export type emailSchema = z.infer<typeof mailSchema>;



const emailverification: NextPage = () => {
    const sendEmail = trpc.verification.sendEmail.useMutation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [formVisible, setFormVisible] = useState(true);
    
    async function handleSubmit(email: string, checkEmail:boolean | undefined) {
        setEmail(email);
        if(checkEmail===true){
            setError("El correo ingresado ya se encuentra registrado");
            setEmail("");
            return;
        }else if(checkEmail===false){
            await sendEmail.mutateAsync({email});
            setFormVisible(false);
        }else{
            setError("Ha ocurrido un error, por favor intente más tarde");
            setEmail("");
            return;
        }
    }
   
    return (
        <div>
            {formVisible ? (
                <Mailform onSubmit={handleSubmit} error={error}/>
            ) : (
                <Message email = {email} onResend={() => setFormVisible(true)}/>
            )}
        </div>
    ) 
}

export default emailverification