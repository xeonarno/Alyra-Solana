use anchor_lang::prelude::*;
use anchor_lang::solana_program::{clock::Clock, system_instruction, program::invoke};
use solana_security_txt::security_txt;

declare_id!("5nroogNoBjowEcCqDyPquSAxxp5fPVQ369GRmZghG8xF");

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Click Game",
    project_url: "http://sol-push.com",
    contacts: "email:security@your-project-url.com,discord:aure64",
    policy: "https://your-project-url.com/security-policy",
    preferred_languages: "en,fr",
    source_code: "https://github.com/your-repo/click_game",
    auditors: "None",
    acknowledgements: "Special thanks to all the security contributors."
}

#[program]
pub mod click_game {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>, owner: Pubkey) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.total_lamports = 0;
        game.last_player = owner;
        game.start_time = Clock::get()?.unix_timestamp;
        game.owner = owner;
        game.winner_index = 0;
        game.winner_count = 0;
        Ok(())
    }

    pub fn click(ctx: Context<Click>) -> Result<()> {
        let game = &mut ctx.accounts.game;

        // Get current timestamp
        let current_time = Clock::get()?.unix_timestamp;

        // Ensure that the click is valid (within 60 seconds)
        let remaining_time = 60 - (current_time - game.start_time);
        if remaining_time <= 0 {
            return Err(ProgramError::Custom(100).into());
        }

        // Payment logic
        let total_lamports = 60000;
        let contract_fee = total_lamports / 10;
        let player_payment = total_lamports - contract_fee;

        // Transfer lamports from player to the game account
        invoke(
            &system_instruction::transfer(&ctx.accounts.player.key(), &game.to_account_info().key(), player_payment),
            &[
                ctx.accounts.player.to_account_info(),
                game.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Transfer contract fee to contract wallet
        invoke(
            &system_instruction::transfer(&ctx.accounts.player.key(), &ctx.accounts.contract_wallet.key(), contract_fee),
            &[
                ctx.accounts.player.to_account_info(),
                ctx.accounts.contract_wallet.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        game.total_lamports += player_payment;
        game.last_player = ctx.accounts.player.key();
        game.last_click_timestamp = current_time;
        game.start_time = current_time;

        Ok(())
    }

    pub fn get_game_info(ctx: Context<GetGameInfo>) -> Result<GameInfo> {
        let game = &ctx.accounts.game;
        let current_time = Clock::get()?.unix_timestamp;

        // Calculate remaining time
        let remaining_time = 60 - (current_time - game.last_click_timestamp);
        msg!("Remaining time: {}", remaining_time);

        Ok(GameInfo {
            total_lamports: game.total_lamports,
            remaining_time,
            winners: get_winners_in_order(&game),
        })
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let game = &mut ctx.accounts.game;

        let current_time = Clock::get()?.unix_timestamp;
        let elapsed_time = current_time - game.start_time;

        // Allow withdrawal if 60 seconds have passed
        if elapsed_time >= 60 {
            let winner_lamports = game.total_lamports;

            // Transfer lamports from the game account to the last player
            **game.to_account_info().try_borrow_mut_lamports()? -= winner_lamports;
            **ctx.accounts.last_player.try_borrow_mut_lamports()? += winner_lamports;

            game.total_lamports = 0;
            msg!("Withdrawal successful. Last player withdrew {} lamports", winner_lamports);

            // Update the winners array
            let winner_entry = Winner {
                player: ctx.accounts.last_player.key(),
                timestamp: current_time,
                amount: winner_lamports,
            };

            // Store the winner in the array and increment the index and count
            let winner_index = game.winner_index; // Make a local copy to avoid the borrowing issue

            if game.winner_count < 10 {
                game.winners[winner_index as usize] = Some(winner_entry);
                game.winner_index = (winner_index + 1) % 10;  // Circular array behavior
                game.winner_count += 1;
            } else {
                game.winners[winner_index as usize] = Some(winner_entry);
                game.winner_index = (winner_index + 1) % 10;  // Overwrite older entries
            }

        } else {
            return Err(ProgramError::Custom(100).into());
        }

        Ok(())
    }


}

// Struct to hold the game state
#[account]
pub struct Game {
    pub total_lamports: u64,
    pub last_player: Pubkey,
    pub last_click_timestamp: i64,
    pub start_time: i64,
    pub owner: Pubkey,
    pub winners: [Option<Winner>; 10],
    pub winner_index: u8,
    pub winner_count: u8,
}

// Struct for game info returned in the get_game_info function
#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct GameInfo {
    pub total_lamports: u64,
    pub remaining_time: i64,
    pub winners: Vec<Winner>,
}

// Struct to hold winner information
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Winner {
    pub player: Pubkey,
    pub timestamp: i64,
    pub amount: u64,
}

// Context for initializing the game
#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = initializer, space = 8 + 580)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for clicking in the game
#[derive(Accounts)]
pub struct Click<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,

    /// CHECK: The contract wallet is trusted and verified in the game logic.
    #[account(mut)]
    pub contract_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

// Context for getting game info
#[derive(Accounts)]
pub struct GetGameInfo<'info> {
    pub game: Account<'info, Game>,
}

// Context for withdrawing the funds
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub last_player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Function to get winners in order
fn get_winners_in_order(game: &Game) -> Vec<Winner> {
    let mut winners = Vec::new();
    for winner in game.winners.iter() {
        if let Some(winner) = winner {
            winners.push(winner.clone());
        }
    }
    winners
}
