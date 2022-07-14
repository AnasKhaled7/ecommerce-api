const sgMail = require('@sendgrid/mail');

function sendEmail(dest, message, subject) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: dest,
        from: 'anas.sendgrid@gmail.com', // Use the email address or domain you verified above
        subject: subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    };
    //ES8
    (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);

            if (error.response) {
                console.error(error.response.body)
            }
        }
    })();
}

module.exports = sendEmail;