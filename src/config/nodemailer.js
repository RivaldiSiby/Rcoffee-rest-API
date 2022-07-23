const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (email, code) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Please confirm your Account",
      html: `<h2>Rcoffee Email Confirmation</h2>
      <h3>Hi Rcoffee Costumer</h3>
      <h3>Thank you for register. Please confirm your email by code confirmation :</h3>
            <h1 style={color:orange;text-align:center}>${code}</h1>
      </div>`,
    };
    const result = await transport.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
};

const sendPasswordConfirmation = async (email, code) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });
    let html = `<h2>Rcoffee Forgot Password Confirmation</h2>
    <h3>Hi Rcoffee Costumer</h3>
    <h3>Here is your account details:</h3>
    <ul>
    <li>Email: <h3>${email}</h3></li>
  </ul>
  YOUR RESET PASSWORD CONFIRMATION CODE: <h1>${code}</h1> <br>
  INPUT THIS CODE WHEN RESET YOUR PASSWORD !
  <h2> 
    </div>`;

    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Forgot Password",
      html,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendConfirmationEmail, sendPasswordConfirmation };
