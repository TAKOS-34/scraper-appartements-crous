const params = require('./config.json');
const send_email = require('./config/mail');

const sleep = (ms, delay) => new Promise(r => setTimeout(r, ms * 1000 + ((Math.random() * delay) * 1000)));
const idTool = params.idTool;
const noms = params.noms.map(nom => nom.toLowerCase());
let filtered_apps = [];
let last_len = 0;
let last_apps = [];



const scraper = async (idTool, localisation, max_price, min_surface, equipments, type_occupation) => {
    try {
        const payload = { "idTool": idTool, "price": { "max": max_price }, "area": { "min": min_surface }, "occupationModes": type_occupation, "equipment": equipments, "need_aggregation": true, "page": 1,"pageSize": 100, "sector": null, "location": localisation, "residence": null, "precision": 6, "toolMechanism": "assignment" }

        const res = await fetch(`https://trouverunlogement.lescrous.fr/api/fr/search/${idTool}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status !== 200) {
            console.log(`<${new Date().toUTCString()}> Error (status != 200) => [${res.status} | ${res.statusText}]\n`);
            return;
        }

        const data = await res.json();

        const total = data.results.total.value;
        const items = data.results.items;

        const apps = items.map(item => ({
            id: item.id,
            name: item.residence.label,
            address: item.residence.address,
            surface_min: item.area.min,
            surface_max: item.area.max,
            price_min: item.occupationModes[0].rent.min / 100,
            price_max: item.occupationModes[0].rent.max / 100,
            equipements: item.equipments.map(eq => eq.label),
            url: `https://trouverunlogement.lescrous.fr/tools/${idTool}/accommodations/${item.id}`
        }));

        if (noms.length > 0) {
            filtered_apps = apps.filter(app => noms.includes(app.name.toLowerCase()));
        } else {
            filtered_apps = apps;
        }

        const new_apps = apps.filter(app => !last_apps.some(a => a.id === app.id));

        if (last_len !== total) {
            console.log(`<${new Date().toUTCString()}> Changed : ${total} (last : ${last_len})\n`);
            send_email(total, filtered_apps, new_apps, last_len);

            last_len = total;
            last_apps = filtered_apps;
        } else {
            console.log(`<${new Date().toUTCString()}> Same : ${last_len}\n`);
        }
    } catch (err) {
        console.error(`<${new Date().toUTCString()}> Error (error catch) => [${err}]\n`);
    }
}



const main = async () => {
    while (1) {
        scraper(
            idTool,
            params.localisation,
            params.prix_max,
            params.surface_min,
            params.equipements,
            params.type_occupation
        );
        await sleep(params.delaie, params.delaie_supp);
    }
}



main();