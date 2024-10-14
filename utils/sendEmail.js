import nodemailer from "nodemailer";

export const sendMail = async (email, subject, payload) => {

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: 'ygiri12345mvn@gmail.com',
                pass: process.env.MAIL_PASSWORD
            }
        })

        var mailOptions = {
            from: 'ygiri12345mvn@gamil.com',
            to: email,
            subject: subject,
            text: JSON.stringify(payload)
        }

        //Sending the link to email
        await transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(`Error in sendEmail: ${err}`);
                return false;
            }
            console.log('Email sent successfully');
            return true;
        })
    } catch (error) {
        console.log(`Error while sending email ${error}`)
        return false;
    }

}