import nodemailer from 'nodemailer';

const email = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
}
let transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 465,
  secure: true,
  auth: {
    user: email.user ,
    pass: email.pass
  }
});

const sendEmail = async (mail: string ,subject:string, html:any) => {
    try {
        transporter.sendMail({
            from: `noreply <${email.user}>`,
            to: mail,
            subject: subject,
            html
        });

    } catch (error) {
        console.log(error)
    }
}
const getTemplate = (verificationCode:string) => {
    return `
         <head>
            <style>
            /* Add your CSS styles here */
            h1 {
                color: #FF0000;
            }
            p {
                font-size: 16px;
            }
            </style>
        </head>
        <body>
            <h1>Código de verificación</h1>
            <p>Hola!</p>
            <p>Este es tu código de verificación: <strong>{${verificationCode}}</strong></p>
            <p>Gracias por utilizar nuestro servicio.</p>
        </body>
    `;
      
}
export {sendEmail, getTemplate};