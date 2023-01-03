import { emailSchema, mailSchema } from "../../pages/verify";
import {TextInput, Button} from 'flowbite-react'
import {SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import { trpc } from '../../utils/trpc';
import { useState } from 'react';

interface EmailFormProps {
  onSubmit: (email: string, checkEmail:boolean) => void;
  error: string;
}
const  Mailform: React.FC<EmailFormProps> = (props) => {
    const {register, handleSubmit, setError,formState:{errors}} = useForm<emailSchema>({
        resolver: zodResolver(mailSchema),
    });
    const checkEmail = trpc.userRouter.checkEmail.useMutation();
   const onSubmit: SubmitHandler<emailSchema> = async (datas) => {
        const check = await checkEmail.mutateAsync({email:datas.email});
        if(check===true){
            setError("email", {message: "El correo ingresado ya se encuentra registrado"});
        }else if(check===false){
            props.onSubmit(datas.email, check);
        }else{
            setError("email", {message: "Ha ocurrido un error, por favor intente más tarde"});
        }
    };
    return(
        //simple centered div with an email input and a button to send the email with tailwindcss
        <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
            <div className="flex flex-col items-center gap-3 w-5/12">
                <h1 className="text-2xl font-poppins mb-4">Verifica tu correo</h1>
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        id="email"
                        type="email"
                        className='w-full'
                        placeholder="Ingrese su correo institucional"
                        required={true}
                        sizing="lg"
                        {...register("email")}
                    />
                    {errors.email?.message && (
                        console.log(errors),
                        <p className="text-red-700 text-sm font-poppins">{errors.email.message}</p>
                    )}  
                    <Button
                        type="submit"
                    >
                        Enviar correo
                    </Button>
                </form>
            </div>
        </div>
    )

}
export default Mailform