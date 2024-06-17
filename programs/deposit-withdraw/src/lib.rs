use anchor_lang::prelude::*;
use solana_program::entrypoint::ProgramResult;

declare_id!("AG4tbUkCfKoxYUhBZTUHmdsqm1uxpmnLPUNNEBpMGQPS");

#[program]
pub mod deposit_withdraw {
    use super::*;
    pub fn initialize(
        ctx: Context<Initialize>,
        nonce: u8,
        total_pool_amount: u64,
        listing_price: u64
    ) -> ProgramResult {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.vault = ctx.accounts.vault.key();
        pool.nonce = nonce;
        pool.total_pool_amount = total_pool_amount;
        pool.pool_amount = 0;
        pool.listing_price = listing_price;

        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> ProgramResult {
        if amount < ctx.accounts.pool.listing_price {
            return Err(ProgramError::from(error!(Errors::InvalidAmount)));
        }

        if ctx.accounts.pool.pool_amount + 1 > ctx.accounts.pool.total_pool_amount {
            return Err(ProgramError::from(error!(Errors::ExceedPoolAmount)));
        }

        let ix = solana_program::system_instruction::transfer(
            &ctx.accounts.depositor.key(),
            &ctx.accounts.vault.key(),
            amount
        );

        solana_program::program::invoke(
            &ix,
            &[ctx.accounts.depositor.to_account_info(), ctx.accounts.vault.to_account_info()]
        )?;

        ctx.accounts.pool.pool_amount += amount;

        let event = Event {
            sender: ctx.accounts.depositor.key(),
            amount,
        };
        emit!(event);

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        // Ensure that the caller is the owner
        if ctx.accounts.authority.key() != ctx.accounts.pool.authority {
            return Err(ProgramError::from(error!(Errors::Unauthorized)));
        }

        let seeds = &[ctx.accounts.pool.to_account_info().key.as_ref(), &[ctx.accounts.pool.nonce]];
        let signer = &[&seeds[..]];
        let lamports = ctx.accounts.vault.to_account_info().lamports();

        if amount > lamports {
            return Err(ProgramError::from(error!(Errors::NotEnoughPoolAmount)));
        }

        solana_program::program::invoke_signed(
            &solana_program::system_instruction::transfer(
                &ctx.accounts.vault.key(),
                &ctx.accounts.receiver.key(),
                amount
            ),
            &[ctx.accounts.vault.to_account_info(), ctx.accounts.receiver.to_account_info()],
            signer
        )?;

        ctx.accounts.pool.pool_amount -= amount;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(nonce: u8)]
pub struct Initialize<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    authority: UncheckedAccount<'info>,

    owner: Signer<'info>,
    #[account(seeds = [pool.to_account_info().key.as_ref()], bump = nonce)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pool_signer: UncheckedAccount<'info>,
    #[account(zero)]
    pool: Box<Account<'info, Pool>>,
    #[account(
        mut,
        seeds = [
            pool.to_account_info().key.as_ref(),
        ],
        bump = nonce,
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    vault: AccountInfo<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        has_one = vault,
    )]
    pool: Box<Account<'info, Pool>>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    vault: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    depositor: AccountInfo<'info>,
    #[account(seeds = [pool.to_account_info().key.as_ref()], bump = pool.nonce)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pool_signer: UncheckedAccount<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        has_one = vault,
    )]
    pool: Box<Account<'info, Pool>>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    vault: AccountInfo<'info>,
    #[account(
        mut,
        constraint = pool.authority == receiver.key(),
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    receiver: AccountInfo<'info>,
    #[account(seeds = [pool.to_account_info().key.as_ref()], bump = pool.nonce)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pool_signer: UncheckedAccount<'info>,
    system_program: Program<'info, System>,

    // Ensure that the withdraw transaction is signed by the authority
    authority: Signer<'info>,
}

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub nonce: u8,
    pub vault: Pubkey,
    pub total_pool_amount: u64,
    pub pool_amount: u64,
    pub listing_price: u64,
}

#[event]
pub struct Event {
    pub sender: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum Errors {
    #[msg("Pool amount is not enough.")]
    NotEnoughPoolAmount,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Exceed pool amount.")]
    ExceedPoolAmount,
    #[msg("Invalid amount.")]
    InvalidAmount,
}
