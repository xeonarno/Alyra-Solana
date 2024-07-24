import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ClickGame } from '../target/types/click_game';

describe('click_game', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.ClickGame as Program<ClickGame>;

  // Accounts used in the tests
  let gameAccount: Keypair;
  let playerAccount: Keypair;
  let contractWallet: Keypair;

  beforeAll(async () => {
    gameAccount = Keypair.generate();
    playerAccount = Keypair.generate();
    contractWallet = Keypair.generate();

    // Airdrop SOL to the player account and contract wallet
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(playerAccount.publicKey, LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(contractWallet.publicKey, LAMPORTS_PER_SOL)
    );
  });

  it('Initializes the game', async () => {
    await program.methods
      .initializeGame(playerAccount.publicKey)
      .accounts({
        game: gameAccount.publicKey,
        initializer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    // Fetch the game account and check the values
    const game = await program.account.game.fetch(gameAccount.publicKey);
    expect(game.totalLamports.toNumber()).toBe(0);
    expect(game.lastPlayer.toString()).toBe(provider.wallet.publicKey.toString());
    expect(game.owner.toString()).toBe(playerAccount.publicKey.toString());
  });

  it('Player clicks the button', async () => {
    await program.methods
      .click()
      .accounts({
        game: gameAccount.publicKey,
        player: playerAccount.publicKey,
        lastPlayer: provider.wallet.publicKey,
        contractWallet: contractWallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([playerAccount])
      .rpc();

    // Fetch the game account and check the values
    const game = await program.account.game.fetch(gameAccount.publicKey);
    expect(game.totalLamports.toNumber()).toBe(54000); // 60000 - 10%
    expect(game.lastPlayer.toString()).toBe(playerAccount.publicKey.toString());

    // Check the contract wallet balance
    const contractBalance = await provider.connection.getBalance(contractWallet.publicKey);
    expect(contractBalance).toBeGreaterThan(LAMPORTS_PER_SOL); // It should be more than the initial airdrop
  });

  it('Checks winner after 60 seconds', async () => {
    jest.setTimeout(65000); // Set timeout to 65 seconds for this test

    // Wait for 60 seconds
    await new Promise((resolve) => setTimeout(resolve, 60000));

    await program.methods
      .checkWinner()
      .accounts({
        game: gameAccount.publicKey,
        lastPlayer: playerAccount.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Fetch the game account and check the values
    const game = await program.account.game.fetch(gameAccount.publicKey);
    expect(game.totalLamports.toNumber()).toBe(0);
    expect(game.lastPlayer.toString()).toBe(playerAccount.publicKey.toString());
    expect(game.winners[0]?.player.toString()).toBe(playerAccount.publicKey.toString());
  });

  it('Gets game info', async () => {
    const game = await program.account.game.fetch(gameAccount.publicKey);

    const current_time = new Date().getTime() / 1000;
    const remaining_time = 60 - (current_time - game.lastClickTimestamp);

    // Check the game info values
    expect(game.totalLamports.toNumber()).toBe(0);
    expect(remaining_time).toBeLessThanOrEqual(60);

    if (game.winners[0]) {
      expect(game.winners[0].player.toString()).toBe(playerAccount.publicKey.toString());
    }
  });
});
