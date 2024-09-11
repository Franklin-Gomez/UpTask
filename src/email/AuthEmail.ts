import { transport } from "../config/nodemailer"

interface IEmail { 
    email : string
    name : string,
    token : string
}

export class AuthEmail { 
    static sendConfirmationEmail = async ( user : IEmail) => { 
        const info = await transport.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to : user.email,
            subject : 'UpTask - Confirma tu cuenta',
            text : 'UpTask - Confirma tu cuenta',
            html : `<p> Hola : ${user.email} , has creado tu c uenta en UpTask , ya casi esta todo listo, solo debes confirmar tu cuenta </p>
                <p> Visita el siguiente enlace : </p>
                <a href="">Confirma cuenta</a>
                <p>E ingresa el codigo : <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('Mensaje enviado' , info.messageId)

    }
}