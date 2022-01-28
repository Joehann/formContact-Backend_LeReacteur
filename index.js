require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

/* MAILGUN */
const api_key = process.env.API_KEY;
const domain = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/send-mail", (req, res) => {
  console.log(req.fields);
  const { firstname, lastname, email, subject, message } = req.fields;

  //création de data
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: process.env.MAIL,
    subject: subject,
    text: message,
  };
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      return res.json({ message: "Données envoyées par mail" });
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
