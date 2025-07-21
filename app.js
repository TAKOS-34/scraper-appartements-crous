const params = require('./config.json');
const { send_success_email, send_failure_email } = require('./config/mail');

const sleep = (ms, delay) => new Promise(r => setTimeout(r, ms * 1000 + ((Math.random() * delay) * 1000)));
const idTool = params.idTool;
const noms = params.noms.map(nom => nom.toLowerCase());
let filtered_apps = [];



const scraper = async (idTool, localisation, max_price, min_surface, equipments, type_occupation) => {
    try {
        const payload = { "idTool": idTool, "price": { "max": max_price }, "area": { "min": min_surface }, "occupationModes": type_occupation, "equipment": equipments, "need_aggregation": true, "page": 1,"pageSize": 100, "sector": null, "location": localisation, "residence": null, "precision": 6, "toolMechanism": "assignment" }

        const res = await fetch(`https://trouverunlogement.lescrous.fr/api/fr/search/${idTool}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': `PHPSESSID=${params.php_sess_id}; qpid=${params.qpid}; tool.${idTool}.hasUserReadRules=true`
            },
            body: JSON.stringify(payload)
        });

        if (res.status !== 200) {
            console.log(`<${new Date().toUTCString()}> Error (request apartments) => [${res.status} | ${res.statusText}]\n`);
            return;
        }

        const data = await res.json();

        const items = data.results.items;

        if (noms.length > 0) {
            filtered_apps = items.filter(app => noms.includes(app.residence.label.toLowerCase()));
        } else {
            filtered_apps = items;
        }

        if (filtered_apps.length > 0) {
            const apps = filtered_apps[0];

            const app = {
                id: apps.id,
                name: apps.residence.label,
                address: apps.residence.address,
                surface_min: apps.area.min,
                surface_max: apps.area.max,
                price_min: apps.occupationModes[0].rent.min / 100,
                price_max: apps.occupationModes[0].rent.max / 100,
                equipements: apps.equipments.map(eq => eq.label),
                url: `https://trouverunlogement.lescrous.fr/tools/${idTool}/accommodations/${apps.id}`
            }

            const _res = await fetch(`https://trouverunlogement.lescrous.fr/api/fr/tools/${idTool}/carts/${params.cart_id}/items`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cookie': `PHPSESSID=${params.php_sess_id}; qpid=${params.qpid}; tool.${idTool}.hasUserReadRules=true`
                },
                body: JSON.stringify({ "accommodation": app.id }),
            });

            if (_res.status !== 200 || !_res.headers.get('content-type').includes('application/json')) {
                console.log(`<${new Date().toUTCString()}> Error (adding to cart) => [${_res.status} | ${_res.statusText}]\n`);
                return;
            }

            const __res = await fetch(`https://trouverunlogement.lescrous.fr/api/fr/tools/${idTool}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': `PHPSESSID=${params.php_sess_id}; qpid=${params.qpid}; tool.${idTool}.hasUserReadRules=true`
                },
                body: new URLSearchParams({
                    'request_submit[occupationMode]': 'alone',
                    'accommodation': app.id
                })
            });

            const __data = await __res.text();

            if (__res.status !== 200 || !__res.headers.get('content-type').includes('application/json')) {
                send_failure_email(__data);
                console.log(`<${new Date().toUTCString()}> Error (reservation failed) => [${__res.status} | ${__res.statusText} | ${__data}]\n`);
            } else {
                send_success_email(app, __data);
                console.log(`<${new Date().toUTCString()}> Successfully reserved apartment: ${app.name}\n`);
            }
        } else {
            console.log(`<${new Date().toUTCString()}> No apartments found\n`);
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