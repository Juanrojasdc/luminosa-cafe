# Luminosa Café

Application web développée pour **Luminosa – With Love, Rachel**, une cafétéria située à Bordeaux, dans le cadre de la préparation au titre professionnel **Développeur Web et Web Mobile (DWWM)**.

Le projet vise à présenter l'établissement, sa carte et ses événements, tout en proposant à terme un espace d'administration permettant à la propriétaire de gérer les contenus du site de manière autonome.

## Présentation du projet

L'application est organisée autour de deux espaces :

**Un espace public**, permettant aux visiteurs de :

- Découvrir la cafétéria.
- Consulter la carte des produits.
- Consulter les événements.
- Accéder à un formulaire de contact.

**Un espace d'administration**, destiné à permettre à la propriétaire de :

- Se connecter de manière sécurisée.
- Gérer les catégories de produits.
- Ajouter, modifier et supprimer des produits.
- Gérer les événements.

Les interfaces d'administration existent actuellement sous forme de démonstration côté React. Leur connexion à une authentification réelle et à des opérations persistantes reste à développer.

## Stack technique

### Front-End

- **React 19** — Bibliothèque de construction des interfaces.
- **Vite 8** — Environnement de développement et outil de build.
- **React Router 7** — Navigation entre les pages.
- **Bootstrap 5** — Composants et mise en page responsive.
- **Sass (SCSS)** — Organisation des styles.
- **JavaScript / JSX** — Développement des composants.
- **Fetch API** — Communication HTTP avec le Back-End.

### Back-End

- **PHP 8.4**
- **Symfony 7.4 LTS** — Framework Back-End.
- **Doctrine ORM** — Gestion des entités et accès aux données.
- **Doctrine Migrations** — Évolution du schéma de la base.
- **API REST** — Exposition des données au format JSON.

### Base de données et outils

- **MySQL 8.3** — Base de données relationnelle.
- **WampServer** — Environnement local.
- **Git / GitHub** — Versionnement et suivi du développement.

## Architecture de l'application

Le projet repose sur une séparation entre le Front-End React et le Back-End Symfony.

```text
                Navigateur
                    |
                    v
              React + Vite
                    |
              HTTP / Fetch
                    |
                    v
             API REST Symfony
                    |
                Doctrine ORM
                    |
                    v
                  MySQL
```

En développement, un proxy Vite redirige les requêtes `/api` vers le serveur Symfony local.

Les pages **Carte** et **Événements** consomment désormais les données provenant de l'API, plutôt que de dépendre uniquement de données statiques.

## Fonctionnalités développées

### Interface publique

- Page d'accueil.
- Page Carte avec affichage des produits et des catégories.
- Page Événements.
- Page Contact avec formulaire côté interface.
- Page 404.
- Navigation entre les pages.
- Mise en page responsive.
- Composants React réutilisables.
- Gestion des états de chargement, d'erreur et de liste vide sur les pages connectées à l'API.

### Back-End et données

- Initialisation du projet Symfony.
- Configuration de la connexion MySQL.
- Création des entités Doctrine.
- Création et utilisation de migrations.
- Mise en place d'une API REST publique en lecture.
- Intégration de l'API avec les pages Carte et Événements.

### Administration

Les interfaces suivantes ont été développées côté React :

- Connexion administrative de démonstration.
- Gestion des produits.
- Gestion des catégories.
- Gestion des événements.

**Important :** ces interfaces utilisent encore des données et des interactions locales simulées. Elles ne disposent pas encore d'une authentification serveur opérationnelle ni d'un CRUD persistant.

## API REST

Les endpoints publics actuellement disponibles sont :

| Méthode | Endpoint                    | Description                                    |
| ------- | --------------------------- | ---------------------------------------------- |
| `GET`   | `/api/categories`           | Récupération des catégories                    |
| `GET`   | `/api/products`             | Récupération des produits                      |
| `GET`   | `/api/food-characteristics` | Récupération des caractéristiques alimentaires |
| `GET`   | `/api/events`               | Récupération des événements                    |
| `GET`   | `/api/health`               | Vérification de la disponibilité de l'API      |

Les données sont retournées au format JSON.

Certaines réponses sont adaptées côté React pour correspondre aux besoins des composants, notamment pour les prix, les catégories et les dates des événements.

## Base de données

La base de données locale s'appelle `luminosa_db`.

Les principales entités Doctrine sont :

- `Category`
- `Product`
- `FoodCharacteristic`
- `Event`
- `Admin`

Une table de liaison permet d'associer les produits à leurs caractéristiques alimentaires.

Les données actuellement utilisées pour les vérifications techniques ne constituent pas nécessairement le contenu définitif de la cafétéria.

## Installation et lancement en local

### Prérequis

- Node.js et npm.
- PHP compatible avec Symfony 7.4.
- Composer.
- MySQL.
- Symfony CLI, pour les commandes présentées ci-dessous.

Une configuration locale de la base de données est également nécessaire.

### 1. Récupérer le projet

```bash
git clone <URL_DU_DEPOT>
cd <DOSSIER_DU_PROJET>
```

Remplacer les valeurs entre chevrons par l'URL et le dossier réels du dépôt.

### 2. Installer et démarrer le Back-End

```bash
cd backend
composer install
```

Configurer la variable d'environnement `DATABASE_URL` pour accéder à une base MySQL locale.

Créer la base si nécessaire :

```bash
php bin/console doctrine:database:create
```

Exécuter les migrations :

```bash
php bin/console doctrine:migrations:migrate
```

Démarrer Symfony :

```bash
symfony server:start
```

Le serveur Back-End est utilisé en développement sur :

`http://127.0.0.1:8000`

### 3. Installer et démarrer le Front-End

Dans un autre terminal, depuis le dossier `frontend` :

```bash
npm install
npm run dev
```

L'application React est accessible en développement sur :

`http://localhost:5173`

Le proxy Vite permet au Front-End d'accéder aux endpoints Symfony via `/api`.

### 4. Vérifications Front-End

```bash
npm run lint
npm run build
```

Ces commandes permettent de vérifier respectivement les règles de lint et la compilation du Front-End.

**Remarque :** cette procédure décrit l'environnement local connu du projet. Elle devra être vérifiée sur une installation propre avant d'être considérée comme un guide d'installation définitif.

## État d'avancement

**Dernière mise à jour documentaire : 12 novembre 2026.**

| Domaine                                     | État                                           |
| ------------------------------------------- | ---------------------------------------------- |
| Conception fonctionnelle                    | Réalisée, avec validations métier à consolider |
| Interfaces publiques React                  | Développées                                    |
| Responsive                                  | Travaillé et vérifié manuellement              |
| Back-End Symfony                            | Opérationnel en local                          |
| Base MySQL et entités Doctrine              | Créées                                         |
| Migrations                                  | Utilisées                                      |
| API REST publique en lecture                | Opérationnelle                                 |
| Intégration React / API pour la Carte       | Réalisée                                       |
| Intégration React / API pour les Événements | Réalisée                                       |
| Interfaces administratives                  | Démonstration locale                           |
| Authentification et autorisations serveur   | À développer                                   |
| CRUD administratifs persistants             | À développer                                   |
| Envoi réel du formulaire de contact         | À développer                                   |
| Téléversement sécurisé des images           | À développer                                   |
| Tests complets et sécurité                  | À compléter                                    |
| Déploiement en production                   | À réaliser                                     |

## Prochaines étapes

Les prochaines étapes de développement concernent principalement :

1. Mettre en place l'authentification et les autorisations administratives avec Symfony.
2. Connecter les interfaces d'administration à des opérations CRUD persistantes.
3. Ajouter les validations serveur nécessaires.
4. Gérer les images des produits.
5. Mettre en place le traitement réel du formulaire de contact.
6. Compléter les tests fonctionnels, techniques et de sécurité.
7. Préparer et vérifier le déploiement en production.
8. Finaliser la documentation et les livrables de certification.

## Périmètre du projet

La première version vise un site vitrine dynamique avec une gestion autonome des contenus.

Les fonctionnalités de commande en ligne, de paiement et de click & collect ne font pas partie du périmètre initial. Elles pourront être étudiées dans une évolution future du projet.

## Contexte de certification

Ce projet est réalisé dans le cadre de la préparation au titre professionnel français **Développeur Web et Web Mobile (DWWM)**.

Il permet de travailler notamment :

- La conception d'interfaces web.
- Le développement Front-End.
- Le développement Back-End.
- La modélisation et l'exploitation d'une base de données relationnelle.
- La communication entre le client et le serveur.
- La sécurisation d'une application web.
- Les tests, la documentation et le déploiement.

Les compétences sont documentées progressivement à partir des réalisations et des preuves disponibles.

## Auteur

Projet développé dans le cadre d'un parcours de formation et de certification **Développeur Web et Web Mobile**.

Application destinée à **Luminosa – With Love, Rachel**, Bordeaux.

---

_Projet en cours de développement — dernière actualisation : 12 novembre 2026._
