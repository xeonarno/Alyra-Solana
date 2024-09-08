import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { ClickGame } from '../target/types/click_game';

describe('click_game', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const program = anchor.workspace.ClickGame as Program<ClickGame>;

  let gameAccount: anchor.web3.Keypair;
  let contractWallet: anchor.web3.Keypair;
  let player1: anchor.web3.Keypair;
  let player2: anchor.web3.Keypair;
  let player3: anchor.web3.Keypair;
  let lastPlayer: PublicKey; // Variable to track the last player dynamically

  beforeEach(async () => {
    gameAccount = anchor.web3.Keypair.generate();
    contractWallet = anchor.web3.Keypair.generate();
    player1 = anchor.web3.Keypair.generate();
    player2 = anchor.web3.Keypair.generate();
    player3 = anchor.web3.Keypair.generate();

    // Airdrop SOL to players and contract wallet
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(gameAccount.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed'
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(contractWallet.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed'
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(player1.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed'
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(player2.publicKey, 3 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed'
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(player3.publicKey, 3 * anchor.web3.LAMPORTS_PER_SOL),
      'confirmed'
    );

    console.log('Game initialized with funds and players have been airdropped SOL.');

    // Initialize the game
    await program.methods
      .initializeGame(player1.publicKey)
      .accounts({
        game: gameAccount.publicKey,
        initializer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([gameAccount])
      .rpc();

    const gameState = await program.account.game.fetch(gameAccount.publicKey);
    console.log('Game initialized with state:', gameState);

    // Set the initial last player to the game initializer (player 1)
    lastPlayer = player1.publicKey;
  });

  it('Simulates a game with three players', async () => {
    // Initial balances
    const player1BalanceBefore = await provider.connection.getBalance(player1.publicKey);
    const player2BalanceBefore = await provider.connection.getBalance(player2.publicKey);
    const player3BalanceBefore = await provider.connection.getBalance(player3.publicKey);
    console.log('Player 1 initial balance:', player1BalanceBefore);
    console.log('Player 2 initial balance:', player2BalanceBefore);
    console.log('Player 3 initial balance:', player3BalanceBefore);

    // First click by player 1
    const firstClickSignature = await program.methods
      .click()
      .accounts({
        game: gameAccount.publicKey,
        player: player1.publicKey,
        lastPlayer, // Use dynamic `lastPlayer`
        contractWallet: contractWallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player1])
      .rpc();
    console.log('First click transaction signature:', firstClickSignature);

    const gameDataAfterFirstClick = await program.account.game.fetch(gameAccount.publicKey);
    console.log('Game data after first click:', gameDataAfterFirstClick);

    // Update last player to player1
    lastPlayer = player1.publicKey;

    // Wait 2 seconds, then second click by player 2
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const secondClickSignature = await program.methods
      .click()
      .accounts({
        game: gameAccount.publicKey,
        player: player2.publicKey,
        lastPlayer, // Use updated `lastPlayer`
        contractWallet: contractWallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player2])
      .rpc();
    console.log('Second click transaction signature:', secondClickSignature);

    const gameDataAfterSecondClick = await program.account.game.fetch(gameAccount.publicKey);
    console.log('Game data after second click:', gameDataAfterSecondClick);

    // Update last player to player2
    lastPlayer = player2.publicKey;

    // Countdown simulation, player 3 clicks at 55 seconds (only once)
    console.log('Waiting for the timer to expire...');
    let player3Clicked = false; // Flag to ensure player 3 only clicks once
    for (let i = 60; i >= 0; i--) {
      console.log(`Timer: ${i} seconds remaining`);
      if (i === 55 && !player3Clicked) {
        console.log('Player 3 clicks!');
        const thirdClickSignature = await program.methods
          .click()
          .accounts({
            game: gameAccount.publicKey,
            player: player3.publicKey,
            lastPlayer, // Use updated `lastPlayer` (should be player2)
            contractWallet: contractWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([player3])
          .rpc();
        console.log('Third click transaction signature:', thirdClickSignature);

        const gameDataAfterThirdClick = await program.account.game.fetch(gameAccount.publicKey);
        console.log('Game data after third click:', gameDataAfterThirdClick);

        // Update last player to player3
        lastPlayer = player3.publicKey;

        player3Clicked = true; // Mark that player 3 has clicked
        i = 60; // Reset the timer to 10 seconds
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1 second delay
    }

    // Timer expired
    console.log('Timer expired!');
    console.log('The winner is:', lastPlayer.toBase58());

    // Player 3 withdraws after the timer ends
    const withdrawSignature = await program.methods
      .withdraw()
      .accounts({
        game: gameAccount.publicKey,
        player: player3.publicKey,
        lastPlayer, // Should be player3 now
        systemProgram: SystemProgram.programId,
      })
      .signers([player3])
      .rpc();
    console.log('Withdraw transaction signature:', withdrawSignature);

    // Check the balance of player 3 after withdrawal
    const player3BalanceAfter = await provider.connection.getBalance(player3.publicKey);
    console.log('Player 3 balance after withdraw:', player3BalanceAfter);

    // Assert that player 3 balance has increased
    assert.isAbove(player3BalanceAfter, player3BalanceBefore, 'Player 3 should have more SOL after withdrawal');

    const gameDataAfterWinning = await program.account.game.fetch(gameAccount.publicKey);
    console.log('Game data after winning:', gameDataAfterWinning);
  });
});
