# Gestion de Stock

Une application Next.js pour gérer efficacement un inventaire, suivre la consommation, surveiller les dates de péremption, et générer des rapports, avec un contrôle d'accès basé sur les rôles des utilisateurs.

## Fonctionnalités principales

### Gestion d'inventaire et de produits
- Liste complète des articles avec nom, description, code-barres, quantité en stock, prix unitaire, et date de péremption.
- Ajout, modification et suppression d'articles.
- Recherche et filtres pour localiser rapidement des articles spécifiques.
- Prise en charge des codes-barres pour scanner les articles.

### Suivi de la consommation
- Calcul automatique des stocks en fonction des entrées et sorties.
- Alertes et rapports pour le réapprovisionnement.

### Expiration des produits
- Avertissements pour les articles dont la date de péremption approche.
- Filtrage par date de péremption pour prioriser l'utilisation.

### Génération de rapports
- Rapports de consommation des articles.
- Rapports sur les coûts des produits et des ingrédients utilisés.
- Rapports sur les niveaux de stock actuels et les dates de péremption.

### Contrôle d'accès
- Niveaux d'accès basés sur les rôles des utilisateurs (employé, administrateur).

---

## Installation

### Prérequis
- **Node.js** (version recommandée : 16.x ou supérieure)
- **npm** ou **yarn**
- Une base de données (PostgreSQL, MongoDB, etc.)
- Clé secrète pour NextAuth (ou toute autre solution d'authentification).

### Étapes d'installation

1. Clonez le repository :
   ```bash
   git clone https://github.com/oussamajomaa/gestion_de_stock.git
   cd gestion_de_stock
   # Gestion de Stock

Une application Next.js pour gérer efficacement un inventaire, suivre la consommation, surveiller les dates de péremption, et générer des rapports, avec un contrôle d'accès basé sur les rôles des utilisateurs.

## Fonctionnalités principales

### Gestion d'inventaire et de produits
- Liste complète des articles avec nom, description, code-barres, quantité en stock, prix unitaire, et date de péremption.
- Ajout, modification et suppression d'articles.
- Recherche et filtres pour localiser rapidement des articles spécifiques.
- Prise en charge des codes-barres pour scanner les articles.

### Suivi de la consommation
- Calcul automatique des stocks en fonction des entrées et sorties.
- Alertes et rapports pour le réapprovisionnement.

### Expiration des produits
- Avertissements pour les articles dont la date de péremption approche.
- Filtrage par date de péremption pour prioriser l'utilisation.

### Gestion des recettes
- Stockage des recettes incluant les ingrédients nécessaires.
- Calcul automatique du coût des repas.

### Génération de rapports
- Rapports de consommation des articles.
- Rapports sur les coûts des produits et des ingrédients utilisés.
- Rapports sur les niveaux de stock actuels et les dates de péremption.

### Contrôle d'accès
- Niveaux d'accès basés sur les rôles des utilisateurs (employé, administrateur).

---

## Installation

### Prérequis
- **Node.js** (version recommandée : 16.x ou supérieure)
- **npm** ou **yarn**
- Une base de données (PostgreSQL, MongoDB, etc.)
- Clé secrète pour NextAuth (ou toute autre solution d'authentification).

### Étapes d'installation

1. Clonez le repository :
   ```bash
   git clone https://github.com/oussamajomaa/gestion_de_stock.git
   cd gestion_de_stock

2. Installez les dépendances :
   ```bash
   npm install

3. Configurez les variables d’environnement : Créez un fichier .env.local à la racine du projet et ajoutez les variables nécessaires :
   ```bash
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_secret_key

4. Configurez la base de données :
   ```bash
   npx prisma init
   npx prisma migrate dev

## Structure du projet
```csharp
gestion_de_stock/
├── .env                  # Variables d'environnement
├── app/                  # Dossier racine des routes (structure Next.js 13+)
├── components/           # Composants réutilisables
├── prisma/               # Fichiers liés à Prisma (schéma, migrations)
├── public/               # Contenus publics (images, assets)
├── services/             # Fonctions métier ou accès à des API
├── types/                # Définition des types TypeScript
├── jest.config.js        # Configuration des tests Jest
├── jest.setup.js         # Fichier de configuration pour Jest
├── tailwind.config.ts    # Configuration de Tailwind CSS
├── tsconfig.json         # Configuration TypeScript
└── README.md             # Documentation

