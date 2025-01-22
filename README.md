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
- Une base de données (MySQL)


### Étapes d'installation

1. **Clonez le repository :**
   ```bash
   git clone https://github.com/oussamajomaa/gestion_de_stock.git
   cd gestion_de_stock

2. **Installez les dépendances :**
   ```bash
   npm install

3. **Configurez les variables d’environnement :** Créez un fichier **.env** à la racine du projet et ajoutez les variables nécessaires :
   ```bash
   DATABASE_URL="mysql://username:password@localhost:3306/base_de_données"
   JWT_SECRET=secret_key

4. **Créer la base de données:** 
   ```bash
      sudo mysql
   ```

   ```mysql
      CREATE DATABASE gestion_de_stock;
   ```

5. **Synchroniser la base de données avec le schéma défini dans prisma:**
   ```bash
   npx prisma migrate deploy
   ```

6. **Complier et préparer l'application pour un déploiement en production:**
   ```bash
      npm run build
   ```

7. **Configurer Apache comme reverse proxy :** Activez les modules nécessaires :
   ```bash
      sudo a2enmod proxy 
      sudo a2enmod proxy_http 
      sudo a2enmod rewrite 
      sudo a2enmod ssl 
      sudo systemctl restart apache2
   ```

8. **Créer un fichier de configuration Apache :**
   ```bash
      sudo nano /etc/apache2/sites-available/osmjom.conf
   ```
   Ajoutez-y cette configuration:
   ```bash
      <VirtualHost *:443>
         ServerName osmjom.fr
         ServerAlias www.osmjom.fr

         # Activer SSL
         SSLEngine On
         SSLCertificateFile /etc/letsencrypt/live/osmjom.fr/fullchain.pem
         SSLCertificateKeyFile /etc/letsencrypt/live/osmjom.fr/privkey.pem

         # Reverse Proxy vers Next.js
         ProxyPreserveHost On
         ProxyPass / http://localhost:3000/
         ProxyPassReverse / http://localhost:3000/

         # Logs pour debug
         ErrorLog ${APACHE_LOG_DIR}/osmjom.fr-error.log
         CustomLog ${APACHE_LOG_DIR}/osmjom.fr-access.log combined
      </VirtualHost>

      <VirtualHost *:80>
         ServerName osmjom.fr
         ServerAlias www.osmjom.fr

         # Redirection HTTP vers HTTPS
         RewriteEngine On
         RewriteCond %{HTTPS} !=on
         RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R=301,L]
      </VirtualHost>

   ```

9. **Configurer un certificat SSL avec Let's Encryp :**
   ```bash
      sudo apt install certbot python3-certbot-apache -y
      sudo certbot --apache -d your-domain.com -d www.osmjom.fr
   ```  

10. **Installer pm2 :** Un gestionnaire de processus pour maintenir l’application Next.js active
   ```bash
      sudo npm install -g pm2
   ```

11. **Exécuter pm2 :**
   ```bash
      pm2 start npm --name "gestion_de_stock" -- start 
   ```

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

