#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("CBqAoNz1odmFdvUj7i2hcmdx1HcDfPrwNynUAaj19PZJ");

#[program]
pub mod click_game {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, owner: Pubkey) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.total_lamports = 0;
        game.last_player = ctx.accounts.initializer.key();
        game.last_click_timestamp = Clock::get().unwrap().unix_timestamp;
        game.owner = owner;
        game.winners = [None; 10];
        game.winner_index = 0;
        game.winner_count = 0;
        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        check_and_distribute_pot(&mut ctx.accounts.game, &ctx.accounts.last_player)?;
        process_click(&mut ctx.accounts.game, ctx.accounts.player.key(), &ctx.accounts.player, &ctx.accounts.contract_wallet)?;
        Ok(())
    }

    pub fn check_winner(ctx: Context<CheckWinner>) -> Result<()> {
        check_and_distribute_pot(&mut ctx.accounts.game, &ctx.accounts.last_player)?;
        Ok(())
    }

    pub fn get_game_info(ctx: Context<GetGameInfo>) -> Result<GameInfo> {
        let game = &ctx.accounts.game;
        let current_time = Clock::get().unwrap().unix_timestamp;
        let remaining_time = 60 - (current_time - game.last_click_timestamp);

        let winners = get_winners_in_order(&game);

        Ok(GameInfo {
            total_lamports: game.total_lamports,
            remaining_time: remaining_time,
            winners: winners,
        })
    }
}

fn get_winners_in_order(game: &Game) -> Vec<Winner> {
    let mut winners = Vec::new();
    let count = game.winner_count.min(10) as usize;

    for i in 0..count {
        let index = (game.winner_index as usize + i) % 10;
        if let Some(winner) = &game.winners[index] {
            winners.push(winner.clone());
        }
    }

    winners
}

fn check_and_distribute_pot(game: &mut Account<Game>, last_player: &AccountInfo) -> Result<()> {
    let current_time = Clock::get().unwrap().unix_timestamp;

    if current_time - game.last_click_timestamp > 60 {
        distribute_pot(game, last_player)?;
    }

    Ok(())
}

fn process_click(
    game: &mut Account<Game>,
    player_key: Pubkey,
    player: &Signer,
    contract_wallet: &AccountInfo,
) -> Result<()> {
    let current_time = Clock::get().unwrap().unix_timestamp;
    let total_lamports = 60000;
    let contract_fee = total_lamports / 10;
    let player_payment = total_lamports - contract_fee;

    **player.to_account_info().try_borrow_mut_lamports()? -= total_lamports;
    **game.to_account_info().try_borrow_mut_lamports()? += player_payment;
    **contract_wallet.try_borrow_mut_lamports()? += contract_fee;

    game.total_lamports += player_payment;
    game.last_player = player_key;
    game.last_click_timestamp = current_time;

    Ok(())
}

fn distribute_pot(game: &mut Account<Game>, last_player: &AccountInfo) -> Result<()> {
    **game.to_account_info().try_borrow_mut_lamports()? -= game.total_lamports;
    **last_player.try_borrow_mut_lamports()? += game.total_lamports;

    update_winners_list(game, last_player.key())?;

    game.total_lamports = 0;

    Ok(())
}

fn update_winners_list(game: &mut Account<Game>, player: Pubkey) -> Result<()> {
    let winner_index = game.winner_index as usize;
    let winner = Winner {
        player: player,
        timestamp: game.last_click_timestamp,
        amount: game.total_lamports,
    };

    game.winners[winner_index] = Some(winner);
    game.winner_index = (game.winner_index + 1) % 10;
    game.winner_count = (game.winner_count + 1).min(10);
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = initializer, space = 8 + 8 + 32 + 8 + 32 + 8 + (32 + 8 + 8) * 10)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Click<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    /// CHECK: This account is used to track the last player, no further checks needed.
    #[account(mut)]
    pub last_player: AccountInfo<'info>,
    /// CHECK: This account is used to collect the contract fee, no further checks needed.
    #[account(mut)]
    pub contract_wallet: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckWinner<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    /// CHECK: This account is used to track the last player, no further checks needed.
    #[account(mut)]
    pub last_player: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetGameInfo<'info> {
    pub game: Account<'info, Game>,
}

#[account]
pub struct Game {
    pub total_lamports: u64,
    pub last_player: Pubkey,
    pub last_click_timestamp: i64,
    pub owner: Pubkey,
    pub winners: [Option<Winner>; 10],
    pub winner_index: u8,
    pub winner_count: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct Winner {
    pub player: Pubkey,
    pub timestamp: i64,
    pub amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GameInfo {
    pub total_lamports: u64,
    pub remaining_time: i64,
    pub winners: Vec<Winner>,
}

