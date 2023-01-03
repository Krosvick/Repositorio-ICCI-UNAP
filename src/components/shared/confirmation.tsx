import { useState } from "react";
import {Card, Button} from "flowbite-react";
export interface MessageProps {
  email: string;
  onResend: () => void;
}

const Message: React.FC<MessageProps> = (props) => {
    const [formVisible, setFormVisible] = useState(true);


  return (
    //flowbite email sended message component, with a button to resend the email
    <div className="flex justify-center items-center h-[calc(100vh-6rem)]">
      <div className="flex flex-col items-center gap-3 w-5/12">
        <Card>
          <h1 className="text-2xl font-poppins mb-4">Verifica tu correo</h1>
          <p className="text-sm font-poppins mb-4">
            Hemos enviado un correo a <span className="font-medium">{props.email}</span>
          </p>
          <p className="text-sm font-poppins mb-4">
            Si no lo encuentras, revisa tu carpeta de spam.
          </p>
          <Button onClick={props.onResend}>Reenviar correo</Button>
        </Card>
      </div>
    </div>  
  );
};

export default Message;
