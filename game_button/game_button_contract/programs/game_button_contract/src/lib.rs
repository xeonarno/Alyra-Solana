use anchor_lang::prelude::*;

declare_id!("2kXynWLtHHwyXVRUBLzqKjL4VhTq1LnGd5PiDanf3w7R"); 

#[program]
pub mod game_button_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, vault: Pubkey, countdown: i64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.vault = vault;
        state.last_clicker = Pubkey::default(); 
        state.last_click_time = 0;
        state.reward_amount = 0;
        state.countdown = countdown;
        Ok(())
    }

    pub fn click_button(ctx: Context<ClickButton>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let current_time = Clock::get()?.unix_timestamp;
        if current_time >= state.last_click_time + state.countdown {
            state.last_clicker = ctx.accounts.user.key();
            state.last_click_time = current_time;
            state.reward_amount += 1;
        } else {
            return Err(ErrorCode::CooldownNotExpired.into());
        }
        Ok(())
    }

    pub fn distribute_rewards(ctx: Context<DistributeRewards>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let current_time = Clock::get()?.unix_timestamp;
        if current_time >= state.last_click_time + state.countdown {
            let reward_amount = state.reward_amount;
            state.reward_amount = 0;

            **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= reward_amount;
            **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += reward_amount;
        } else {
            return Err(ErrorCode::CooldownNotExpired.into());
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 8 + 8 + 8)] 
    pub state: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClickButton<'info> {
    #[account(mut)]
    pub state: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub vault: Account<'info, Vault>, 
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub state: Account<'info, GameState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub vault: Account<'info, Vault>, 
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GameState {
    pub vault: Pubkey,
    pub last_clicker: Pubkey,
    pub last_click_time: i64,
    pub reward_amount: u64,
    pub countdown: i64,
}

#[account]
pub struct Vault {
}

#[error_code]
pub enum ErrorCode {
    #[msg("Cooldown period has not expired.")]
    CooldownNotExpired,
}
