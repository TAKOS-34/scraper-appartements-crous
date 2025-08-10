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



const send_email = (total, apps, new_apps, last_len) => {
    transporter.sendMail({
        from: params.user,
        to: params.user_email,
        subject: `Update Appartements CROUS`,
        html: `
            <h1>Update Appartements CROUS</h1>
            ${total === 0 ? `<p>🚫 Plus d'appartements disponible</p>` : `<p>${Math.abs(total - last_len)} ${total - last_len > 0 ? `🎉 Nouveau(x) appartement(s)` : `❌ Appartement(s) en moins`} (maintenant : ${total}, anciennement : ${last_len})</p>`}
            <br><hr><br>

            ${new_apps.length !== 0 ? `
                <h3>🆕 Les nouveaux :</h3>
                <br>
                ${new_apps.map(item => `
                    <p>🏠 <b>Nom :</b> ${item.name} <a style="color: red;">(NOUVEAU)</a></p>
                    <p>📍 <b>Adresse :</b> ${item.address}</p>
                    <p>📐 <b>Surface :</b> ${item.surface_min === item.surface_max ? `${item.surface_min}m²` : `De ${item.surface_min} à ${item.surface_max}m²`}</p>
                    <p>💶 <b>Prix :</b> ${item.price_min === item.price_max ? `${item.price_min}€` : `De ${item.price_min} à ${item.price_max}€`}</p>
                    <p>🛏️ <b>Equipements :</b> ${item.equipements.join(', ')}</p>
                    <p>🔗 <b>Lien :</b> <a href="${item.url}" target="_blank">${item.url}</a></p>
                    <br><br>
                `).join('')}
                <br><hr><br></br>`
            : ``}

            ${apps.length !== 0 ? `
                <h3>La liste complète</h3>
                <br>
                ${apps.map(item => `
                    <p>🏠 <b>Nom :</b> ${item.name}</p>
                    <p>📍 <b>Adresse :</b> ${item.address}</p>
                    <p>📐 <b>Surface :</b> ${item.surface_min === item.surface_max ? `${item.surface_min}m²` : `De ${item.surface_min} à ${item.surface_max}m²`}</p>
                    <p>💶 <b>Prix :</b> ${item.price_min === item.price_max ? `${item.price_min}€` : `De ${item.price_min} à ${item.price_max}€`}</p>
                    <p>🛏️ <b>Equipements :</b> ${item.equipements.join(', ')}</p>
                    <p>🔗 <b>Lien :</b> <a href="${item.url}" target="_blank">${item.url}</a></p>
                    <br><br>
                `).join('')}
                <hr>`
            : ``}
        `
    }, (err, info) => {
        if (err) {
            console.log(`<${new Date().toUTCString()}> Error while sending mail => [${err}]\n`);
        } else {
            console.log(`<${new Date().toUTCString()}> Mail sent successfully\n`);
        }
    });
}



module.exports = send_email;