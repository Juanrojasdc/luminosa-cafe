# Luminosa — With Love, Rachel

J'ai développé Luminosa pour un café situé à Bordeaux, dans le cadre de ma formation de Développeur Web et Web Mobile. Le site permet de découvrir le café, sa carte et ses événements, puis de contacter l'établissement. La propriétaire peut gérer les contenus depuis un espace d'administration, sans modifier le code.

Le site est accessible sur [luminosa-cafe.fr](https://luminosa-cafe.fr).

## Fonctionnalités

Les visiteurs peuvent consulter la carte par catégorie, les prix, la disponibilité, les caractéristiques alimentaires et les événements. Le formulaire de contact transmet les messages par Resend.

La propriétaire peut se connecter pour créer, modifier et supprimer des catégories, produits et événements, changer leur ordre et gérer leurs images. Ces données sont enregistrées dans MySQL. Les commandes, paiements et comptes clients ne font pas partie du périmètre du site.

## Technologies et architecture

Le dossier `frontend/` contient React 19, React Router 7, JavaScript/JSX, Vite 8, Sass, Bootstrap 5 et Bootstrap Icons. Le dossier `backend/` contient Symfony 7.4, Doctrine ORM et Migrations. Le navigateur utilise `fetch()` et des URL relatives pour appeler l'API Symfony, qui accède à MySQL. Le contact utilise Resend.

En développement, Vite transmet `/api` et `/uploads` au serveur Symfony local grâce au [proxy](frontend/vite.config.js). Sur OVHcloud, Apache sert React compilé et les fichiers publics; Symfony répond aux appels `/api`. Les fichiers privés Symfony restent hors de la racine web.

L'API publique propose `GET /api/categories`, `GET /api/products`, `GET /api/food-characteristics`, `GET /api/events` et `GET /api/health`. Les pages React utilisent ces réponses JSON. Les opérations administratives sont protégées par une session, le rôle `ROLE_ADMIN` et un jeton CSRF pour les écritures.

## Prérequis

| Outil | Utilisation | Vérification |
|---|---|---|
| PHP 8.4 recommandé | Exécuter Symfony | `php -v` |
| Composer | Installer les dépendances PHP | `composer --version` |
| Node.js 24 recommandé et npm | Installer et compiler React | `node -v`, `npm -v` |
| MySQL | Conserver les données | Vérifier le service et ouvrir phpMyAdmin |
| Symfony CLI | Démarrer le serveur avec les commandes ci-dessous | `symfony -V` |

Le projet déclare PHP `>=8.2` dans [composer.json](backend/composer.json), mais il faut aussi respecter les exigences des dépendances installées. Les versions bloquées de Vite et ESLint demandent ensemble Node `^20.19.0 || ^22.13.0 || >=24`. La préparation précédente a utilisé PHP 8.4.27 et Node 24.22.1. Les versions précises des bibliothèques sont dans `composer.lock` et `package-lock.json`; `composer check-platform-reqs` permet de vérifier PHP et ses extensions sur la machine cible.

Sur Windows, [WampServer](https://www.wampserver.com/) peut fournir PHP, MySQL et phpMyAdmin. Il n'est pas obligatoire si ces outils sont déjà disponibles. Installer Composer depuis [getcomposer.org](https://getcomposer.org/), Node.js depuis [nodejs.org](https://nodejs.org/) et, pour les commandes ci-dessous, Symfony CLI depuis [symfony.com/download](https://symfony.com/download).

## Installation locale

Télécharger le dépôt depuis [GitHub](https://github.com/Juanrojasdc/luminosa-cafe) :

```text
git clone https://github.com/Juanrojasdc/luminosa-cafe.git
cd luminosa-cafe
```

Une archive ZIP du dépôt peut aussi être téléchargée puis extraite. Ouvrir un terminal dans le dossier qui contient `frontend/`, `backend/` et `docs/`.

### Configurer le back-end

Avant `composer install`, créer `backend/.env.local`. Ce fichier, propre à chaque machine, est ignoré par Git. Le générer avec les valeurs **fictives** suivantes, puis les remplacer selon votre environnement :

```dotenv
APP_ENV=dev
APP_DEBUG=1
APP_SECRET=REMPLACER_PAR_UN_SECRET_LOCAL
DATABASE_URL="mysql://UTILISATEUR_LOCAL:MOT_DE_PASSE_LOCAL@127.0.0.1:3306/luminosa_local?serverVersion=VERSION_MYSQL_LOCALE&charset=utf8mb4"
DEFAULT_URI=http://127.0.0.1:8000
RESEND_API_KEY=REMPLACER_PAR_UNE_CLE_PERSONNELLE_SI_NECESSAIRE
CONTACT_FROM_EMAIL=expediteur@example.test
CONTACT_TO_EMAIL=destinataire@example.test
```

Pour créer un secret local, exécuter `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"` et copier le résultat dans `APP_SECRET`. Choisir le serveur, le port, la base, l'utilisateur et la version MySQL réels pour `DATABASE_URL`. Les caractères spéciaux du mot de passe MySQL doivent être encodés dans cette URL. `DEFAULT_URI` donne à Symfony son adresse locale par défaut.

Les valeurs de contact fictives permettent de configurer l'application, mais **pas d'envoyer un message**. Un envoi réel exige une clé Resend personnelle autorisée, un domaine expéditeur vérifié et un destinataire adapté. Ne pas employer les accès de la propriétaire pour une installation locale.

### Installer les dépendances

Depuis la racine du dépôt, ouvrir un terminal dans chaque dossier :

```text
cd backend
composer install
```

```text
cd frontend
npm ci
```

Ces commandes respectent `composer.lock` et `package-lock.json`. Les auto-scripts de Composer démarrent Symfony; c'est pourquoi `.env.local` doit être préparé avant son installation.

### Créer la base et les données de référence

Vérifier que MySQL est démarré. Avec WampServer, ouvrir phpMyAdmin depuis son interface et confirmer le serveur, le port et l'utilisateur utilisés. Revenir dans `backend/`, avec `DATABASE_URL` dirigée vers une **base nouvelle** :

```text
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:schema:validate
```

La première commande crée la base; la deuxième applique la migration qui crée les tables; la troisième compare le schéma et les entités. Dans phpMyAdmin, sélectionner cette nouvelle base et vérifier que les tables `admin`, `category`, `product`, `event` et `food_characteristic` existent.

Importer ensuite [backend/data/food_characteristics.sql](backend/data/food_characteristics.sql) : dans phpMyAdmin, sélectionner la base, ouvrir **Importer**, choisir le fichier et lancer l'importation. La table `food_characteristic` doit contenir huit noms, dont « Antioxydant ». Le script peut être relancé séquentiellement sans ajouter ces noms une seconde fois. Il ne crée ni catalogue ni administrateur. Au départ, le catalogue est vide; ses contenus peuvent être créés dans l'administration.

### Créer le premier administrateur

Aucun compte ni mot de passe par défaut n'est fourni. Depuis `backend/`, lancer :

```text
php bin/console security:hash-password
```

Choisir `App\Entity\Admin` si la commande demande une classe, puis saisir un mot de passe choisi pour cette installation à l'invite. Ne pas le placer dans la commande. Copier le **hash obtenu**, pas le mot de passe, dans phpMyAdmin : sélectionner la nouvelle base, ouvrir la table `admin`, puis **Insérer**. Renseigner `first_name`, `last_name`, `email` et `password` (avec le hash). Laisser `id_admin` à sa valeur auto-incrémentée. Utiliser ensuite cet email et le mot de passe choisi sur `/admin/login`.

### Démarrer et vérifier

Ouvrir deux terminaux depuis la racine du dépôt :

```text
# Terminal 1
cd backend
symfony server:start --port=8000
```

```text
# Terminal 2
cd frontend
npm run dev
```

Ouvrir `http://localhost:5173`. Vérifier `/api/health` via le navigateur ou le proxy Vite, puis la carte et `/admin/login`. Une réponse correcte de health ne prouve pas à elle seule que la base fonctionne : vérifier aussi les huit caractéristiques et une connexion avec le compte local. Si l'API est inaccessible, vérifier le serveur Symfony et le proxy; si les tables manquent, vérifier `DATABASE_URL` et les migrations.

Pour contrôler le frontend, exécuter `npm run lint` et `npm run build` depuis `frontend/`. Pour le backend, `php bin/console lint:container` et `php bin/console doctrine:schema:validate` se lancent depuis `backend/`, avec la configuration locale correcte.

## Sécurité et déploiement

L'administration utilise des sessions Symfony, des mots de passe hashés, `ROLE_ADMIN`, un jeton CSRF pour les écritures et des validations côté serveur. Les clés, mots de passe, sauvegardes et fichiers `.env.local` ou `.env.prod.local` restent hors du dépôt. Garder également la configuration de production hors de la racine publique.

La [procédure de déploiement OVH](docs/deploiement-ovh.md) décrit la préparation du paquet et les adaptations propres à `www/`. Le dépôt contient le code source; les données MySQL et les images administrées appartiennent à chaque installation.

## Site public

[https://luminosa-cafe.fr](https://luminosa-cafe.fr)
