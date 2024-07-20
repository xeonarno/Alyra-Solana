import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GameButtonContract } from "../target/types/game_button_contract";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

describe("game_button_contract", () => {
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GameButtonContract as Program<GameButtonContract>;

  let user: Keypair;
  let vault: Keypair;

  beforeEach(async () => {
    user = Keypair.generate();
    vault = Keypair.generate();

    // Airdrop SOL to user if needed
    await program.provider.connection.requestAirdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL);
  });

  it("Initializes the game", async () => {
    const tx = await program.rpc.initialize({
      accounts: {
        state: user.publicKey,
        vault: vault.publicKey,
        payer: user.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [user],
    });

    console.log("Transaction signature:", tx);
  });

  it("Clicks the button", async () => {
    const tx = await program.rpc.clickButton({
      accounts: {
        state: user.publicKey,
        vault: vault.publicKey,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [user],
    });

    console.log("Transaction signature:", tx);
  });
});
