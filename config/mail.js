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
            <h1>Nouvelle appartement réservé CROUS</h1>
            <br><br>

            <h3>Caractéristiques :</h3>
            <br>
            <p><strong>Nom : </strong><a>${app.name} <a style="color: red;">(NOUVEAU)</a></a></p>
            <p><strong>Adresse : </strong><a>${app.address}</a></p>
            <p><strong>Surface : </strong><a>${app.surface_min === app.surface_max ? `${app.surface_min}m²` : `De ${app.surface_min} à ${app.surface_max}m²`}</a></p>
            <p><strong>Prix : </strong><a>${app.price_min === app.price_max ? `${app.price_min}€` : `De ${app.price_min} à ${app.price_max}€`}</a></p>
            <p><strong>Equipements : </strong><a>${app.equipements.join(', ')}</a></p>
            <p><strong>Lien : </strong><a href="${app.url}" target="_blank">${app.url}</a></p>
            <hr><br><br>

            <h3>Informations complémentaires :</h3>
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