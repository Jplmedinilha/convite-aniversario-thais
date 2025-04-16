const express = require("express");
const path = require("path");

const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();
const PORT = 3000;

// Lista de convidados
var guests = [
  { name: "Thaís Luz", password: "9371", confirm: "Y" },
  { name: "João Medinilha", password: "1842", confirm: "N" },
  { name: "Soraia Luz", password: "2058", confirm: "N" },
  { name: "Mario Luz", password: "2058", confirm: "N" },
  { name: "Thiago Luz", password: "7214", confirm: "N" },
  { name: "Iria Viegas", password: "3985", confirm: "N" },
  { name: "Carol Bento", password: "6203", confirm: "N" },
  { name: "Mauricio Bento", password: "6203", confirm: "N" },
  { name: "Manuela Bento", password: "6203", confirm: "N" },
  { name: "Betinha Fellet", password: "1460", confirm: "N" },
  { name: "Ka", password: "3647", confirm: "N" },
  { name: "Dê", password: "3647", confirm: "N" },
  { name: "André de Paula", password: "8742", confirm: "N" },
  { name: "Priscila", password: "8742", confirm: "N" },
  { name: "Tati", password: "6004", confirm: "N" },
  { name: "Carol Medeiros", password: "2197", confirm: "N" },
  { name: "Hugo Medeiros", password: "2197", confirm: "N" },
  { name: "Rafa Medeiros", password: "2197", confirm: "N" },
  { name: "Manu Medeiros", password: "2197", confirm: "N" },
  { name: "Beatriz Luz", password: "4361", confirm: "N" },
  { name: "Donatinho Luz", password: "7946", confirm: "N" },
  { name: "Elisa Luz", password: "2685", confirm: "N" },
  { name: "Arnaldo Luz", password: "3552", confirm: "N" },
  { name: "Flavia", password: "3552", confirm: "N" },
  { name: "Manuela", password: "9040", confirm: "N" },
  { name: "Rogerio Viegas", password: "1426", confirm: "N" },
  { name: "Rose Viegas", password: "1426", confirm: "N" },
];

app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "page.html"));
});

app.get("/getGuests", (req, res) => {
  res.json(guests);
});

app.post("/confirmPresence", async (req, res) => {
  const { name, password } = req.body;

  const guest = guests.find((g) => g.name === name);

  if (!guest) {
    try {
      sendMail(
        "Convidado não encontrado",
        `O convidado ${name} não esta registrado`
      );
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ message: "Email error" + error });
    }
    return res.status(404).json({ message: "Convidado não encontrado." });
  }

  if (guest.password === password) {
    guest.confirm = "Y";
    console.log(`Presença de ${name} confirmada.`);

    try {
      sendMail(
        "🎉 Presença Confirmada",
        `O convidado ${name} confirmou presença.`
      );
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ message: "Email error" + error });
    }

    return res
      .status(200)
      .json({ message: "Presença confirmada com sucesso!" });
  } else {
    try {
      sendMail(
        "Senha errada",
        `O convidado ${name} Digitou a senha errada. \n Digitada ${password} - Certa ${guest.password}`
      );
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ message: "Email error" + error });
    }
    return res.status(401).json({ message: "Senha incorreta." });
  }
});

async function sendMail(subject, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADD,
      pass: process.env.EMAIL_PW,
    },
  });

  const mailOptions = {
    from: '"convite-thais" <' + process.env.EMAIL_ADD + ">",
    to: [
      process.env.EMAIL_ADD,
      process.env.EMAIL_ADD_W,
      process.env.EMAIL_ADD_S,
    ],
    subject: subject,
    text: message + "\n" + JSON.stringify(guests),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o email:", error);
  }
}

module.exports = sendMail;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
