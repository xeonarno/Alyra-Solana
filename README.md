# Alyra-Solana

## Apprenants

- Aurélien Monteillet
-
-

## Lien

CandyMachine Explorer : [link](<https://www.solaneyes.com/address/FCwLouhfyuUJtheHSawaEyGzyG1w4ZWjxu8dTg9CJnNW>)
Mint Page : [link](<https://sol-push-mint.vercel.app/>)

## Objectif
Ce projet est dapp Solana qui permet de rassembler la communauté Sol autour d'un jeu simple. Un bouton, un compte à rebours, le dernier à cliquer sur le bouton remporte la cagnotte. Afin de faire durer le jeu, le compte à rebours est remis à 0 à chaque clic sur le bouton.

## Fonctionnalités
1. **Connexion Wallet**
   - Bouton "Connect Wallet" pour permettre à l'utilisateur de se connecter à son portefeuille Solana.
   - Affichage de la balance SOL de l'utilisateur après la connexion.

2. **Compte à Rebours**
   - Affichage d'un compte à rebours en temps réel sur la page principale, qui se rafraîchit automatiquement et qui est reset (ou ajoute +5 secondes ou +10) à chaque fois que des sol sont ajoutés avec un cap à 1 min.

3. **Bouton d'Interaction**
   - Un gros bouton au centre de la page pour que l'utilisateur puisse interagir.

4. **Interaction avec le Bouton**
   - Lorsqu'un utilisateur clique sur le bouton, une petite quantité de SOL est prélevée de son portefeuille.
   - La moitié des SOL prélevés est ajoutée à la cagnotte du jeu.
   - L'autre moitié est distribuée aux détenteurs d'une collection NFT que l'on va déployé.

5. **Intégration NFT**
   - Création et gestion d'une collection NFT sur Solana. 
      - Utilisation des PNft afin d'obliger les royalties pour continuer le jeu.
   - Redistribution automatique des fonds vers les détenteurs de cette collection lors des interactions avec le bouton.


## Architecture Générale
### Frontend (Client Web)
#### Prerequisites

-   Node v18.18.0 or higher
-   Solana CLI 1.18.9 or higher
#### Install Dependencies

```shell
npm install

Start the web app

```shell
npm run dev

 Build the web app

```shell
npm run build

- **Frameworks/Bibliothèques** : Next.js 
- **Fonctionnalités** :
  - Connexion au portefeuille Solana
  - Affichage de la balance utilisateur
  - Affichage du compte à rebours
  - Gestion des événements de clic sur le bouton

### Backend (Smart Contract)
- **Technologie** : Smart contract sur Solana
- **Fonctionnalités** :
  - Gestion des transactions Solana pour le prélèvement et la redistribution des SOL
  - Logique de redistribution des fonds

### Base de Données
- **Optionnelle** : Pour le suivi des utilisateurs, des transactions, etc.

## Actions à coder
### Frontend
- Créer une interface utilisateur responsive.
- Intégrer la connexion au portefeuille Solana.
- Afficher la balance SOL de l'utilisateur.
- Implémenter le compte à rebours et le bouton d'interaction.

### Backend
- Développer le smart contract pour gérer les transactions de jeu.
- Mettre en œuvre la logique de redistribution des SOL vers la cagnotte et les détenteurs de NFT.

### Intégration NFT
- Créer et gérer une collection NFT sur Solana.
- Configurer la distribution des fonds aux détenteurs de NFT lors des interactions avec le bouton.

## Dépendances
- **Frontend** :
  - Next.js
- **Backend** :
  - Solana CLI
  - Anchor
- **NFT** :
  - Metaplex Sugar

## Déploiement
1. **Déploiement du Frontend** :
   - 

2. **Déploiement du Smart Contract** :
   - 

3. **Création et Déploiement de la Collection NFT** :
   - Création d'une candy-machine V3 à l'aide de Sugar
   - Ajoute des json et des png dans le dossier assets
   - Gestion de la config pour ajouter le standart PNFT, les fees, les rulesset ainsi que le guard solPayment pour le mint
   - Lancement de l'upload et vérification de la CM
   - Création du frontend avec bouton de connexion de wallet et bouton mint

## Test
- Plan de test pour vérifier le bon fonctionnement des fonctionnalités clés :
  - Connexion au portefeuille
  - Affichage correct de la balance
  - Fonctionnement du compte à rebours
  - Prélèvement et redistribution des SOL
  - Distribution des fonds aux détenteurs de NFT

## Limitations
- Système de vote pour ajouter des fonctionnalités dans le jeu

## Améliorations Futures
- Système de jeu par communauté
- Futur token pour jouer via le token au lieu du sol (airdrop pour les holders du nft ainsi que les grosses commu sol)
- Plusieurs modes de jeu différent (timer moins long, temps random à chaque fois qu'on met des sol)

