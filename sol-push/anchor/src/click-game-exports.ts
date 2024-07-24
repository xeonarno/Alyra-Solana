// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import ClickGameIDL from '../target/idl/click_game.json';
import type { ClickGame } from '../target/types/click_game';

// Re-export the generated IDL and type
export { ClickGame, ClickGameIDL };

// The programId is imported from the program IDL.
export const CLICK_GAME_PROGRAM_ID = new PublicKey(ClickGameIDL.address)

// This is a helper function to get the ClickGame Anchor program.
export function getClickGameProgram(provider: AnchorProvider) {
  return new Program(ClickGameIDL as ClickGame, provider);
}

// This is a helper function to get the program ID for the ClickGame program depending on the cluster.
export function getClickGameProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return CLICK_GAME_PROGRAM_ID
  }
}
