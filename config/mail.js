const nodemailer = require('nodemailer');
const params = require('../config.json');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: params.user_email,
        pass: params.user_password,
    }
});



const send_success_email = (app, infos) => {
    transporter.sendMail({
        from: params.user,
        to: params.user_email,
        subject: `Update Appartements CROUS`,
        html: `
            <h1>🎉 Nouvelle appartement réservé CROUS</h1>
            <br><br>

            <h3>🔎 Caractéristiques :</h3>
            <br>
            <p>🏠 <b>Nom :</b> ${app.name}</p>
            <p>📍 <b>Adresse :</b> ${app.address}</p>
            <p>📐 <b>Surface :</b> ${app.surface_min === app.surface_max ? `${app.surface_min}m²` : `De ${app.surface_min} à ${app.surface_max}m²`}</p>
            <p>💶 <b>Prix :</b> ${app.price_min === app.price_max ? `${app.price_min}€` : `De ${app.price_min} à ${app.price_max}€`}</p>
            <p>🛏️ <b>Équipements :</b> ${app.equipements.join(', ')}</p>
            <p>🔗 <b>Lien :</b> <a href="${app.url}" target="_blank">${app.url}</a></p>
            <hr><br><br>

            <h3>ℹ️ Informations complémentaires :</h3>
            <br>
            <p>${infos}</p>
        `
    }, (err, info) => {
        if (err) {
            console.log(`<${new Date().toUTCString()}> Error while sending mail => [${err}]\n`);
        } else {
            console.log(`<${new Date().toUTCString()}> Mail sent successfully\n`);
        }
    });
}



const send_failure_email = (err) => {
    transporter.sendMail({
        from: params.user,
        to: params.user_email,
        subject: `Update Appartements CROUS`,
        html: `
            <h1>Erreur de réservation CROUS</h1>
            <br><br>
            <p>Une erreur s'est produite lors de la réservation de l'appartement :</p>
            <p>${err}</p>
        `
    }, (err, info) => {
        if (err) {
            console.log(`<${new Date().toUTCString()}> Error while sending mail => [${err}]\n`);
        } else {
            console.log(`<${new Date().toUTCString()}> Mail sent successfully\n`);
        }
    });
}



module.exports = { send_success_email, send_failure_email };