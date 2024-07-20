# sol-push

This project is generated with the [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) generator.

## Getting Started

### Prerequisites

-   Node v18.18.0 or higher

-   Rust v1.77.2 or higher
-   Anchor CLI 0.30.0 or higher
-   Solana CLI 1.18.9 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```

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
   - Redistribution automatique des fonds vers les détenteurs de cette collection lors des interactions avec le bouton.

## Architecture Générale
### Frontend (Client Web)
- **Technologies** : 
- **Frameworks/Bibliothèques** : React.js 
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
- **Optionnelle** : Pour le suivi des utilisateurs, des transactions, etc. (à définir selon les besoins)

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
  - React.js
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







# Todo 
- ~~git pour le monde~~
- compilation simple (front et contrat)
- On code le button qui récupère le wallet
- On code le timer 
- On code le button qui paie
- on code le contrat en back
- on enregistre le paiement
- Update le timer
- On déploie
- On teste sur testNet/devnet
- ~~Faucet pour tout le monde~~
- se répartir les rôles
- les slides 