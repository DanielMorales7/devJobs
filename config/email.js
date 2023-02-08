import nodemailer from "nodemailer";

const emailRegistro = async (datos) =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email, resetUrl} = datos;

    //Enviar el email
    
    const info = await transporter.sendMail({
        from:'"devJobd"  <noreply@correo.com>',
        to:email,
        subject: 'Comprueba tu cuenta',
        text:'Comprueba tu cuenta',
        html:`<p>Hola: Reestaura tu contraseña </p>
              <p>Da click en el siguiente enlace</p>
              <a href=${resetUrl}> Enlace</a>
              <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s ", info.messageId);
    
}

export default emailRegistro;