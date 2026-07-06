const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"Smart Weather Alert" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });

        console.log("Email Sent:", info.messageId);
    } catch (error) {
        console.error("Email Error:", error);
    }
}



async function sendWelcomeEmail(user) {
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">
    
    <h2 style="color:#2196F3;">
    🌤 Welcome to Smart Weather Alert
    </h2>
    
    <p>Hello <b>${user.name}</b>,</p>
    
    <p>
    Thank you for joining <b>Smart Weather Alert</b>.
    </p>
    
    <p>
    You will receive timely weather alerts before severe weather conditions.
    </p>
    
    <hr>
    
    <h3>Your Profile</h3>
    
    <p>📍 Location : ${user.city}, ${user.state}, ${user.country}</p>
    
    <p>⏰ Alert Before : ${user.notifyBefore} minutes</p>
    
    <hr>
    
    <p>
    Stay safe and enjoy using Smart Weather Alert.
    </p>
    
    </div>
    `;
    
    await sendEmail(
        user.email,
        "🌤 Welcome to Smart Weather Alert",
        html
    );
    
}



module.exports = {
    sendEmail,
    sendWelcomeEmail
};