// server.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const ownerEmail = process.env.MAIL_USER;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    cors({
        origin: "*", // Cambia esto a donde sirvas tu frontend
    })
);
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor de contacto funcionando");
});
app.get("/api/test", (req, res) => {
    try {
        res.json({ message: "API de contacto funcionando correctamente"});
    } catch (error) {
        res.json({ error: error.message})
    }
})
// Ruta del formulario
app.post("/api/contact", async (req, res) => {
    const { name, email, projectType, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        // Configuración del transporter (ejemplo con Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: ownerEmail, // tu email
                pass: process.env.MAIL_PASSWORD, // contraseña de aplicación
            },
        });

        const mailOwner = {
            from: `"WoodCraft Studio" <${ownerEmail}>`,
            to: ownerEmail, // destinatario final
            subject: "Nuevo mensaje desde la web",
            text: `
        Nombre: ${name}
        Email: ${email}
        Tipo de proyecto: ${projectType || "No especificado"}

        Mensaje:
        ${message}
        `,
            html: `
            <h2>Nuevo mensaje desde la landing</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Tipo de proyecto:</strong> ${projectType || "No especificado"}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
      `,
        };

        const mailUser = {
            from: `"WoodCraft Studio" <${ownerEmail}>`,
            to: email, // destinatario final
            subject: "Confirmacion de recepción de mensaje",
            html: `
            <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f7f7f7; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #e5e5e5;">

                    <h2 style="color: #f58232; font-size: 24px; margin-bottom: 16px; font-weight: 600;">
                        ¡Gracias por contactarnos, ${name}!
                    </h2>

                    <p style="font-size: 15px; color: #333333; line-height: 1.6; margin-bottom: 14px;">
                        Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.
                    </p>

                    <p style="font-size: 15px; color: #333333; line-height: 1.6; margin-top: 20px;">
                        Saludos,<br>
                        <span style="font-weight: bold; color: #f58232;">El equipo de WoodCraft Studio</span>
                    </p>

                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOwner);
        await transporter.sendMail(mailUser);

        res.json({ ok: true, message: "Correo enviado correctamente" });
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
