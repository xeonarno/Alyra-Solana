import { assert } from 'chai';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { GameButtonContract } from '../target/types/game_button_contract';

describe('game_button_contract', () => {
    // Configure le provider avec l'environnement local
    const provider = AnchorProvider.env();  // Utilisez AnchorProvider au lieu de Provider
    const program = new Program<GameButtonContract>(
        // Remplacez par l'IDL et le programme correct
        require('../target/idl/game_button_contract.json'),
        "3GLEa1QnQt3NYcNxXDQQRG6yztTgCSxajLwoyXwHxMMP",
        provider
    );

    // Définir des comptes de test
    const stateAccount = web3.Keypair.generate();
    const userAccount = web3.Keypair.generate();
    const vaultAccount = web3.Keypair.generate();

    it('should initialize the contract and click button', async () => {
        // Test d'initialisation
        const tx = await program.methods.initialize(
            vaultAccount.publicKey
        ).accounts({
            state: stateAccount.publicKey,
            user: userAccount.publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([stateAccount, userAccount]).rpc();

        console.log('Initialization Transaction Signature:', tx);

        // Test du clic sur le bouton
        const tx2 = await program.methods.clickButton()
            .accounts({
                state: stateAccount.publicKey,
                user: userAccount.publicKey,
                vault: vaultAccount.publicKey,
                systemProgram: web3.SystemProgram.programId,
            }).signers([userAccount]).rpc();

        console.log('Click Button Transaction Signature:', tx2);

        // Récupérer et vérifier l'état
        const state = await program.account.gameState.fetch(stateAccount.publicKey);
        assert.isNotNull(state, 'State account should not be null');
        console.log('State:', state);
    });
});
