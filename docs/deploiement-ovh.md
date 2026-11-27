# Déploiement de Luminosa sur OVHcloud Perso

Ce guide décrit comment **reconstruire et installer** l'application depuis un clone propre. Le déploiement actuel de la propriétaire est déjà fonctionnel; ne pas le remplacer pour essayer ce guide. La reconstruction et le retour arrière doivent d'abord être testés sur une copie isolée. Domaine public : [luminosa-cafe.fr](https://luminosa-cafe.fr).

## 1. Architecture et prérequis

La racine web OVH est `www`. Le code Symfony, ses dépendances, la configuration privée, le cache et les logs restent dans un dossier frère `luminosa`, **hors de `www`** :

```text
/home/<compte>/
├── luminosa/                # Symfony privé : bin, config, src, vendor, var, composer.*
│   ├── .env                 # seulement APP_ENV=prod et APP_DEBUG=0
│   └── .env.prod.local      # valeurs privées créées sur le serveur
└── www/                     # racine publique OVH
    ├── index.php            # point d'entrée Symfony
    ├── index.html           # build React
    ├── .htaccess
    ├── assets/
    ├── uploads/             # images administrées persistantes
    └── favicon.svg, icons.svg
```

Vérifier avant transfert : PHP 8.4 sur l'hébergement, MySQL, extensions exigées par `composer check-platform-reqs`, HTTPS valide, accès SFTP, phpMyAdmin, espace disque et droits d'écriture pour `luminosa/var` et `www/uploads`. Dans l'espace client OVHcloud, contrôler l'hébergement concerné, les sites et leurs domaines, la racine web, la version PHP, les accès FTP-SSH, la base et le certificat. Les intitulés peuvent évoluer selon l'interface et l'offre. Un `.ovhconfig` à la racine du compte peut sélectionner PHP 8.4 et `environment=production`; comparer sa configuration réelle avant tout changement. Ne pas utiliser de permissions `777`. React compilé ne demande pas Node sur le serveur; Symfony demande PHP.

Le dépôt fixe les dépendances par `package-lock.json` et `composer.lock`. Le navigateur et l'API utilisent une même origine, avec les URLs `/api` et `/uploads`. Aucune infrastructure supplémentaire n'est nécessaire.

## 2. Sauvegarder avant une installation ou mise à jour

Conserver une copie privée du `www` existant, du projet `luminosa`, de la base MySQL et des uploads **du même état fonctionnel**. Ne jamais mettre un dump SQL, des secrets, des sessions ou des logs dans Git ou dans `www`. Ne jamais supprimer des images distantes inconnues parce qu'elles sont absentes d'un nouveau build.

Une installation neuve part d'une base vide. Une restauration importe une base et les uploads correspondants; elle ne rejoue pas aveuglément l'initialisation de référence. Pour reproduire un état publié, utiliser une sauvegarde autorisée de la base et des images correspondantes. Une sauvegarde n'est dite restaurable qu'après un essai de restauration isolé.

## 3. Construire le paquet hors du dépôt source

Utiliser une copie de travail neuve au commit voulu et un dossier vide `paquet` contenant `luminosa` et `www`. Ne jamais lancer ces opérations dans le site distant. Dans la copie du front-end :

```text
cd frontend
npm ci
npm run lint
npm run build
```

Arrêter si une commande échoue : ne pas substituer silencieusement un ancien `dist`. Copier **le contenu** de `frontend/dist` dans `paquet/www`, puis vérifier que les fichiers `/assets` référencés dans `index.html` existent. Ne pas copier `node_modules` ni `frontend/src` dans le paquet.

Dans une copie du back-end, installer les dépendances verrouillées :

```text
cd backend
composer install --no-dev --prefer-dist --optimize-autoloader --no-scripts
composer check-platform-reqs --no-dev
```

`--no-scripts` évite de créer un cache local ou d'installer des assets dans une mauvaise racine publique; préparer le cache `prod` après configuration privée sur l'hébergement, si le compte le permet. Copier dans `paquet/luminosa` les éléments réellement nécessaires : `bin`, `config`, `src` (y compris `src/Migrations`), `vendor`, `composer.json`, `composer.lock`, `symfony.lock`. Créer `var` vide. Ajouter une `.env` minimale contenant uniquement `APP_ENV=prod` et `APP_DEBUG=0`. Ne copier aucun `.env.*.local`, cache Windows, log, session ni dump SQL.

Copier `backend/public/index.php` et `backend/public/.htaccess` vers `paquet/www`. Les ressources `favicon.svg` et `icons.svg` sont fournies par le build Vite; en contrôler la présence. Créer `paquet/www/uploads`, sans y introduire d'images non vérifiées.

## 4. Appliquer les quatre adaptations OVH

Le fichier [`adaptations-ovh.diff`](adaptations-ovh.diff) transforme **uniquement la copie** déjà structurée en `paquet/luminosa` et `paquet/www`. Il ne doit pas être appliqué à `backend/` du dépôt. Il adapte l'autoload de `www/index.php`, la route physique des uploads injectée dans `services.yaml` et utilisée par `ImageUploader`, puis le `.htaccess` public. Ce dernier garde le routage `/api`, le fallback React, les assets et la restriction des noms d'uploads; il ajoute le refus des chemins privés et une redirection **temporaire 307** vers `https://luminosa-cafe.fr`.

Sous Windows, Git for Windows fournit généralement `patch.exe` dans `C:\Program Files\Git\usr\bin`. Depuis PowerShell, avec des chemins adaptés à votre machine :

```powershell
$patchTool = 'C:\Program Files\Git\usr\bin\patch.exe'
$packageRoot = 'C:\chemin\vers\paquet'
$patchFile = 'C:\chemin\vers\clone\docs\adaptations-ovh.diff'
& $patchTool --dry-run --batch -p1 -d $packageRoot -i $patchFile
& $patchTool --batch -p1 -d $packageRoot -i $patchFile
```

Vérifier que la première commande se termine sans erreur et affiche les quatre fichiers prévus. N'exécuter la seconde commande que si ce contrôle réussit **et** si `paquet` est bien une copie isolée. Aucun `git apply`, changement d'index ou de branche n'est nécessaire. Vérifier ensuite les quatre fichiers par comparaison avec le diff et contrôler la syntaxe PHP. Si `patch.exe` n'est pas disponible, arrêter et utiliser une méthode contrôlée de patch sur copie; ne pas éditer à la main sans documenter les écarts.

Pour un autre domaine ou sous-domaine, modifier **dans le paquet uniquement** le domaine canonique de `www/.htaccess` : la condition sur `HTTP_HOST` et la destination de `RewriteRule` doivent correspondre au domaine choisi. Adapter aussi `DEFAULT_URI` dans `.env.prod.local`. Si le domaine n'a pas de variante `www`, retirer la condition correspondante dans cette copie. Vérifier ensuite que toute route et ses paramètres restent sur le bon domaine et que la redirection temporaire 307 ne boucle pas derrière l'infrastructure OVH. Le domaine inscrit dans le diff est celui du site actuellement publié : ne pas appliquer le paquet tel quel à un autre domaine.

La protection de `www/uploads` interdit les noms autres que ceux générés par l'application; les fichiers privés restent hors du document root.

## 5. Configurer les données et secrets sur OVH

Créer **sur le serveur et hors de `www`** `/home/<compte>/luminosa/.env.prod.local` avec les valeurs de la propriétaire :

```dotenv
APP_ENV=prod
APP_DEBUG=0
APP_SECRET=REMPLACER_PAR_UN_SECRET_ALEATOIRE_PRIVE
DATABASE_URL=REMPLACER_PAR_L_URL_MYSQL_PRIVEE
DEFAULT_URI=https://luminosa-cafe.fr
RESEND_API_KEY=REMPLACER_PAR_LA_CLE_PRIVEE_DE_LA_PROPRIETAIRE
CONTACT_FROM_EMAIL=REMPLACER_PAR_UN_EXPEDITEUR_VERIFIE
CONTACT_TO_EMAIL=REMPLACER_PAR_LE_DESTINATAIRE_AUTORISE
```

Les placeholders ne sont pas utilisables tels quels. Ne pas reprendre la clé, le secret ou la base du premier hébergement. Symfony charge la `.env` minimale, puis `.env.prod.local` pour `prod`. `DEFAULT_URI` est indispensable : son absence a déjà causé un HTTP 500. Le domaine de l'expéditeur Resend doit être vérifié; la possession de la clé Sending access ne prouve pas cette vérification. L'expéditeur et le destinataire ont des rôles distincts. Ne pas activer publiquement `APP_DEBUG`.

Pour une **base neuve**, choisir d'abord son nom dans `DATABASE_URL`. Si un accès aux commandes PHP est disponible, exécuter depuis `luminosa/` `php bin/console doctrine:migrations:migrate --no-interaction`, puis importer `backend/data/food_characteristics.sql` avec phpMyAdmin dans la base sélectionnée. Créer le premier administrateur selon le README principal et saisir le catalogue depuis l'administration.

Si l'offre ne permet que SFTP et phpMyAdmin, préparer une **base locale neuve et vide** avec la même migration, exporter son schéma via phpMyAdmin, puis importer cet export dans la base OVH neuve sélectionnée. Importer ensuite séparément le SQL des huit caractéristiques. Ne pas exporter une base locale contenant des comptes ou des données privées pour remplacer ce schéma. Cette variante doit être essayée sur une installation isolée avant de servir de procédure validée.

Pour une **restauration**, importer la sauvegarde SQL approuvée et les uploads correspondants; vérifier versions de migrations, tables, compte administratif, chemins d'images et intégrité avant toute nouvelle migration. N'importer aucun dump privé dans une base non prévue.

## 6. Transférer et vérifier

Installer [FileZilla Client](https://filezilla-project.org/) si nécessaire. Dans son gestionnaire de sites, créer une entrée **SFTP**, puis renseigner l'hôte, le port et l'utilisateur fournis par l'espace client OVHcloud; saisir le secret par un moyen privé. Le panneau gauche montre les fichiers locaux, le panneau droit le serveur. Contrôler les deux chemins avant la première copie. Transférer **le contenu** de `paquet/luminosa` vers `/home/<compte>/luminosa` et **le contenu** de `paquet/www` vers `/home/<compte>/www`. Vérifier les transferts en attente et les erreurs dans la file de FileZilla. Confirmer que `vendor`, `src`, `.env.prod.local` et les logs ne se trouvent pas dans `www`.

Ne pas vider `www` lors d'une mise à jour : conserver les uploads persistants et la configuration privée. `luminosa/var` doit être inscriptible par PHP; consulter les erreurs Symfony/OVH par accès privé. La configuration Monolog du dépôt envoie les erreurs de production vers `php://stderr` : vérifier où OVH les collecte, sans profiler public ni `phpinfo`.

Après transfert, contrôler HTTPS et domaine canonique, chargement des assets, rechargement direct des routes React, `/api/health`, catégories, produits et événements, images, login/logout, accès non autorisé, CSRF, CRUD, ordre, uploads et contact. Confirmer séparément la réception du message et le `Reply-To`. Tester les routes privées et les ressources absentes sans afficher de contenu potentiellement sensible. Vérifier cookies de session et droits réels. Le DNS et le certificat doivent être validés sur l'hébergement; ce guide ne les modifie pas.

## 7. Retour arrière

Si la mise à jour échoue, restaurer les fichiers sauvegardés et, si des écritures ont eu lieu, la base **avec ses uploads du même état**. Contrôler au minimum `/`, `/api/health`, catalogue, images et login. Ne pas restaurer seulement le code en supposant que les données ou images n'ont pas changé. Documenter l'incident sans publier secrets ou logs bruts.
