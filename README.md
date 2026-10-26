# HomeCyclHome

Application de réservation de réparation de vélo sur Lyon pour LeCycleLyonnais.
Projet réalisé dans le cadre de la formation Concepteur Développeur d'Applications de la Fabrique Numérique Paloise (64).

### Technologies

Next 16
Nextjs 11
PostGIS 17

### Installation

Requis:

- Docker
- Nodejs

./backend/.env :

```
DATABASE_URL= url de db postgres
JWT_SECRET= généré avec openssl rand -hex 32
JWT_EXPIRES_IN= temps d'expiration
FRONTEND_URL= url frontend
```

#### Développement

```bash
docker compose -f docker-compose.dev.yml up
```

##### Jeu de données de test

```bash
docker compose -f docker-compose.dev.yml exec backend npx prisma db seed
```

#### Production

```bash
docker compose up -d
```

#### CI/CD

Pipeline effectuée avec Github Actions.
