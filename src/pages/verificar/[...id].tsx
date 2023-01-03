import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Card } from "flowbite-react";


const verify = () => {
    const router = useRouter();
    const id = router.query.id;
    const verify = trpc.verification.verify.useMutation();

    useEffect(() => {
        if(typeof window !== "undefined" && id){if(!id){
            return;
        }else{
            const hashedId=router.asPath.replace("/verificar/","");
            verify.mutate({hashedId});
        }}
    },[id,verify,router.asPath]);
    
    const handleConfirmation = () => {
        router.push("/");
    }
    return (
        <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
            <div className="flex flex-col items-center gap-3 w-5/12">
                <Card>
                    <h1 className="text-2xl font-poppins mb-4">Verificación completada</h1>
                    <p className="text-sm font-poppins mb-4">
                        Tu correo ha sido verificado con éxito, serás redirigido a la página principal.
                    </p>
                </Card>
            </div>
        </div>


    )
}
export default verify