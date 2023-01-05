import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER_VERCEL;
const pass = process.env.EMAIL_PASS_VERCEL; 
export const mailer=async(email:string,hash:string,path:string,textLink:string)=>{

    
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        service:'Zoho',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: user, // generated ethereal user
            pass: pass, // generated ethereal password
        },
    });
    
    
    
    const info = await transporter.sendMail({
        from: user, // sender address
        to: email, // list of receivers
        subject: "Confirmacion de correo", // Subject line
        text: "Hola", // plain text body
        html: `<div>
        <b>Hola  </b>, 
        <p>este es tu correo de verificación</p>
        <a target='blanck' href='http://localhost:3000/${path}${hash}'>${textLink}</a>
        <p>Si no has solicitado este correo, por favor ignoralo</p>
        <p>Unap repositorio</p>
        </div>`
        
    }); 


    return(info)
}

