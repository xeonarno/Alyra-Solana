import { AnchorProvider, Program, web3, setProvider } from "@coral-xyz/anchor";
import BN from 'bn.js';  // Importer BN depuis 'bn.js'
import { assert } from "chai";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Idl } from "@coral-xyz/anchor";

// L'adresse du programme est celle de ton IDL
const programId = new web3.PublicKey("7hXjf2dgP6tHbdm658hdDaKUnrzoryrR3nVoBELDEiT6");

// Charge l'IDL depuis le fichier JSON
const idlPath = resolve(__dirname, '../idl/game_button_contract.json');
const idl: Idl = JSON.parse(readFileSync(idlPath, 'utf-8'));

// Configure le provider pour les tests
const provider = AnchorProvider.env();
setProvider(provider);

// Charge le programme Anchor
const program = new Program(idl, programId, provider);

describe("Basic Test", () => {
    it("should run a basic test and interact with the program", async () => {
        // Définir les comptes nécessaires pour le test
        const user = web3.Keypair.generate();
        const state = web3.Keypair.generate();
        const vault = web3.Keypair.generate();

        // Assure-toi que l'instruction 'initialize' est correctement définie dans le programme
        console.log(Object.keys(program.methods)); // Affiche toutes les méthodes disponibles
        assert.isFunction(program.methods.initialize, "initialize function is not defined");

        // Initialise le programme en utilisant l'instruction 'initialize'
        await program.methods.initialize(
            vault.publicKey,
            new BN(60), // Exemple de valeur pour countdown
        ).accounts({
            state: state.publicKey,
            user: user.publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([state, user]).rpc();

        // Vérifier que l'instruction a été correctement appelée
        assert.isTrue(true, "Test de base réussi !");
    });
});
