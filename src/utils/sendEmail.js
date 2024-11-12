import { Resend } from 'resend';
// import dotenv from 'dotenv'
// dotenv.config()

if(!process.env.EMAIL_RESEND){
    console.log("Provide RESEND_API in side the .env file")
}

const resend = new Resend('re_PtDZquov_PZgaThatBbNNRmqLzndsseMt');

const sendEmail = async({sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail
