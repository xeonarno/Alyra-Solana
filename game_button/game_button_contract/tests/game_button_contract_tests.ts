import { AnchorProvider, Program, web3, setProvider } from "@coral-xyz/anchor";
import BN from 'bn.js';
import { assert } from "chai";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Idl } from "@coral-xyz/anchor";

const programId = new web3.PublicKey("7hXjf2dgP6tHbdm658hdDaKUnrzoryrR3nVoBELDEiT6");

const idlPath = resolve(__dirname, '../idl/game_button_contract.json');
const idl: Idl = JSON.parse(readFileSync(idlPath, 'utf-8'));

const provider = AnchorProvider.env();
setProvider(provider);

const program = new Program(idl, programId, provider);

describe("Basic Test", () => {
    it("should run a basic test and interact with the program", async () => {
        const user = web3.Keypair.generate();
        const state = web3.Keypair.generate();
        const vault = web3.Keypair.generate();

        console.log(Object.keys(program.methods));
        assert.isFunction(program.methods.initialize, "initialize function is not defined");


        await program.methods.initialize(
            vault.publicKey,
            new BN(60),
        ).accounts({
            state: state.publicKey,
            user: user.publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([state, user]).rpc();

        assert.isTrue(true, "Test de base réussi !");
    });
});
