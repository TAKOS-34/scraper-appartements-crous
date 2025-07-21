# TUTO - UTILISATION D'UN BOT SCRAPER POUR TROUVER UN APPARTEMENT CROUS

Le but du projet est de vous aider à obtenir un appartement CROUS, ce qui peut être assez dur si vous avez un échelon assez bas, voire si vous n'êtes même pas boursier. Un bot pourra donc, en fonction de vos préférences, vous envoyer par mail une liste d'appartements disponibles selon votre secteur et vos critères, voire il pourra même réserver à votre place, même si la procédure est légèrement plus lourde. Tout a été fait pour que même ceux qui n'y connaissent rien puissent y arriver. Il va falloir ouvrir un terminal, donc ça peut faire peur, mais il n'y a rien de compliqué.

## Avant toute chose

Il existe trois versions de ce bot, vous pouvez changer la version en changeant de branche, comme le montre l'image ci-dessous :
![Changement de branche](img/img0.jpg)

Voici ce que fait le bot en fonction de sa version :
- `main` : Le bot vous enverra un mail avec tous les appartements disponibles selon votre secteur et vos critères dans un mail listant les appartements disponibles, leurs caractéristiques et le lien pour les consulter sur le site du CROUS. Dans cette version, aucune connexion n'est nécessaire, mais il y aura moins d'appartements proposés
- `auto-mail` : Le bot vous enverra un mail avec tous les appartements disponibles selon votre secteur et vos critères dans un mail listant les appartements disponibles, leurs caractéristiques et le lien pour les consulter sur le site du CROUS. Dans cette version, une connexion est nécessaire au compte et il faudra alors récupérer son token d'authentification, mais tout vous sera expliqué si vous sélectionnez cette branche dans ce README
- `auto-reservation` : Le bot réservera le premier appartement disponible selon votre secteur et vos critères, il enverra un mail vous disant s'il a réussi la réservation ou bien s'il a échoué ainsi que la raison de l'échec. Dans cette version, une connexion est nécessaire au compte et il faudra alors récupérer son token d'authentification, mais tout vous sera expliqué si vous sélectionnez cette branche dans ce README

Nous sommes ici dans la version `mail` du README.

## 1ère Étape : Créer un mot de passe d'application à utiliser pour l'email

On utilisera Google, donc vous pouvez utiliser votre compte ou en créer un nouveau. Vous pouvez utiliser un autre service mais il faudra ajuster le code selon vos besoins (dans le fichier `mail.js`, qui se trouve dans le dossier `config`).

- Aller sur les paramètres de votre compte Google
- Chercher dans la barre de recherche : Mots de passe des applications
- Saisissez votre mot de passe
- Créer un nouveau mot de passe d'application, remplissez le champ "Nom de l'appli" avec ce que vous voulez, exemple : "CROUS" et cliquez sur créer
- Le plus important, gardez le mot de passe qui sera affiché, il devrait ressembler à quelque chose comme ceci : `iaip wwea yypm xznp`

Ensuite on peut aller dans le fichier `config.json` :

- Ligne 6 : Remplir le champ user avec ce que vous voulez, ce sera le nom affiché dans l'email
- Ligne 7 : Remplir le champ user_email par votre email
- Ligne 8 : Remplir le champ user_password par le mot de passe d'application précédemment créé

## 2ème Étape : Lancer l'application

- Télécharger nodejs (https://nodejs.org/fr)
- Lancer un terminal (je vous laisse regarder comment faire sur internet / demander à une IA) dans le dossier du projet et faites les commandes suivantes :
- `npm i` (Installer les dépendances)
- `npm start` (Lancer l'application)

L'application fonctionne directement, il suffit de la laisser tourner sur votre ordinateur autant de temps que vous le souhaitez et vous recevrez un mail en fonction des paramètres mis.

## 3ème Étape : Les paramètres (localisation, prix, surface, ...)

Tout se passe dans le fichier `config.json` :

- idTool - Ligne 2 : Chercher un appartement pour votre ville et récupérer le numéro de l'url entre tools/ et /search, voir l'image ci-dessous :
![Récupération de l'IdTool depuis l'url pendant une recherche](img/img1.jpg)

- Localisation - Ligne 12 à 15 : Ici sont les coordonnées de la ville recherchée. Il suffit de les remplacer par les vôtres. Allez sur le site du CROUS, faites une recherche d'appartement dans votre ville et regardez les chiffres en paramètres de l'url, voir l'image ci-dessous :
![Récupération des coordonnées de la ville pendant une recherche](img/img2.jpg)

- Prix maximum - Ligne 16 : Mettez le prix maximum souhaité avec le chiffre sans virgule, soit 5 chiffres. Par exemple si vous voulez maximum 250€ mettez 25000, car ce sera interprété comme 250.00. Par défaut la valeur est 10000000 afin d'avoir le maximum de propositions possible

- Surface minimum - Ligne 17 : Mettez ce que vous voulez. Par exemple si vous voulez 9m² minimum, mettez 9. Si vous voulez 18m² minimum, mettez 18. Par défaut la valeur est 0 pour la même raison que pour le prix maximum

- Type d'occupation - Ligne 18 : Ceci est un choix multiple entre Seul (`alone`), Couple (`couple`) et Colocation (`house_sharing`). Si vous souhaitez Seul mettez : ["alone"], si vous souhaitez seul ou colocation mettez : ["alone", "house_sharing"]. Si vous souhaitez les trois : ["alone", "couple", "house_sharing"]. Par défaut les trois sont sélectionnées pour la même raison que pour le prix maximum

- Équipements - Ligne 19 : Choix multiple encore avec les équipements entre `WC`, `Douche`, `Frigo`, `Evier + plaque` et `Balcon`. Si vous voulez des toilettes, douche et frigo mettez : ["WC", "Douche", "Frigo"]. Si vous voulez cela et une cuisine alors : ["WC", "Douche", "Frigo", "Evier + plaque"]

- Noms - Ligne 20 : Vous pouvez mettre des noms de résidences sous forme de liste (en minuscules), par exemple : ["maison des etudiants", "bazeilles"]. Si vous ne mettez rien il n'y aura aucun filtre et tout sera sélectionné peu importe le nom de la résidence

Une fois l'application relancée alors tous les filtres seront appliqués et les appartements qui seront envoyés par email seront ceux répondant à vos critères.

## Autres informations bonus

- Délai - Ligne 24 & 25 : `delaie` est le délai fixe minimum entre les requêtes et `delaie_supp` un délai en plus aléatoire entre 0 et la valeur choisie. Par exemple avec le choix de base ce sera 5 5, soit 5 secondes minimum + un délai aléatoire entre 0 et 5 secondes. Vous pouvez le modifier si vous voulez

- Si jamais le bot ne fonctionne pas vérifiez bien que vous avez mis les bons paramètres et pensez à tester sur des zones avec des appartements déjà disponibles

- Si vous préférez lancer le bot sur autre chose que votre ordinateur personnel il existe des solutions en ligne, comme Glitch. Sinon si vous avez un VPS ça marche très bien aussi. Le mieux c'est de laisser tourner le bot sur un vieux pc qui traîne