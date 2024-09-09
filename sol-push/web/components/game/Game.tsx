'use client';

import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram, Transaction, TransactionInstruction, Keypair } from '@solana/web3.js';
import idl from '../../app/idl/click_game.json';

const programID = new PublicKey(idl.address);
const CLICK_INSTRUCTION_DISCRIMINATOR = Buffer.from([11, 147, 179, 178, 145, 118, 45, 186]);
const GET_GAME_INFO_DISCRIMINATOR = Buffer.from([140, 141, 245, 71, 227, 131, 217, 93]);
const WITHDRAW_INSTRUCTION_DISCRIMINATOR = Buffer.from([36, 89, 177, 49, 118, 230, 143, 120]); // Withdraw discriminator (fake bytes)

const Game = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [loading, setLoading] = useState(false);
    const [gameAccount, setGameAccount] = useState<PublicKey | null>(null);
    const [contractWallet, setContractWallet] = useState<PublicKey | null>(null);
    const [totalLamports, setTotalLamports] = useState<number | null>(null); // Total des lamports pour le clic
    const [estimatedFee, setEstimatedFee] = useState<number | null>(null); // Stocker les frais estimés
    const [logs, setLogs] = useState<string[]>([]); // Pour afficher les logs sur la page

    const addLog = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const initializeGame = async () => {
        try {
            setLoading(true);
            addLog('--- Initializing Game (manual transaction) ---');

            if (!publicKey) {
                addLog("Wallet not connected");
                return;
            }

            const gameAccount = Keypair.generate();
            setGameAccount(gameAccount.publicKey);
            addLog(`Generated new Game account: ${gameAccount.publicKey.toBase58()}`);

            const contractWallet = Keypair.generate();
            setContractWallet(contractWallet.publicKey);
            addLog(`Generated new Contract Wallet: ${contractWallet.publicKey.toBase58()}`);

            const GAME_ACCOUNT_SIZE = 8 + 580;
            const lamports = await connection.getMinimumBalanceForRentExemption(GAME_ACCOUNT_SIZE);
            addLog(`Lamports required for rent exemption: ${lamports}`);

            const { blockhash } = await connection.getLatestBlockhash();
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: publicKey,
            }).add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: gameAccount.publicKey,
                    space: GAME_ACCOUNT_SIZE,
                    lamports,
                    programId: programID,
                })
            );

            addLog('Transaction created');

            const estimatedFee = await connection.getFeeForMessage(transaction.compileMessage());
            addLog(`Estimated fee for game initialization: ${estimatedFee.value} lamports`);
            setEstimatedFee(estimatedFee.value);

            const signature = await sendTransaction(transaction, connection, {
                signers: [gameAccount],
            });

            addLog(`Transaction confirmed with signature: ${signature}`);
            setLoading(false);
        } catch (error) {
            addLog('--- Error initializing game ---');
            addLog(`Error details: ${error}`);
            setLoading(false);
        }
    };

    const getGameInfo = async () => {
        if (!gameAccount) {
            addLog('Game account is not set');
            return;
        }

        try {
            addLog('--- Fetching game info ---');

            const instruction = new TransactionInstruction({
                keys: [{ pubkey: gameAccount, isSigner: false, isWritable: false }],
                programId: programID,
                data: GET_GAME_INFO_DISCRIMINATOR,
            });

            addLog('Created instruction for get_game_info');

            const { blockhash } = await connection.getLatestBlockhash();
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: publicKey,
            }).add(instruction);

            addLog('Transaction created for get_game_info');

            const estimatedFee = await connection.getFeeForMessage(transaction.compileMessage());
            addLog(`Estimated fee for fetching game info: ${estimatedFee.value} lamports`);
            setEstimatedFee(estimatedFee.value);

            const signature = await sendTransaction(transaction, connection);
            addLog(`Game info transaction confirmed with signature: ${signature}`);

            setTotalLamports(60000); // Mettre à jour avec le montant obtenu depuis le contrat
        } catch (error) {
            addLog('--- Error fetching game info ---');
            addLog(`Error details: ${error}`);
            setLoading(false);
        }
    };

    const clickGame = async () => {
        if (!gameAccount || !contractWallet || !publicKey || !totalLamports) {
            addLog("Game account, Contract wallet, or publicKey is missing, or totalLamports is not set.");
            return;
        }

        try {
            setLoading(true);
            addLog('--- Clicking in Game ---');

            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: gameAccount, isSigner: false, isWritable: true },
                    { pubkey: publicKey, isSigner: true, isWritable: true }, // Player's account
                    { pubkey: contractWallet, isSigner: false, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                ],
                programId: programID,
                data: CLICK_INSTRUCTION_DISCRIMINATOR,
            });

            const { blockhash } = await connection.getLatestBlockhash();
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: publicKey,
            }).add(instruction);

            const estimatedFee = await connection.getFeeForMessage(transaction.compileMessage());
            addLog(`Estimated fee for clicking in game: ${estimatedFee.value} lamports`);
            setEstimatedFee(estimatedFee.value);

            const signature = await sendTransaction(transaction, connection);
            addLog(`Transaction confirmed with signature: ${signature}`);
            setLoading(false);
        } catch (error) {
            addLog('--- Error clicking in game ---');
            addLog(`Error details: ${error}`);
            setLoading(false);
        }
    };

    const withdraw = async () => {
        if (!gameAccount || !publicKey) {
            addLog("Game account or publicKey is missing.");
            return;
        }

        try {
            setLoading(true);
            addLog('--- Withdrawing funds ---');

            const instruction = new TransactionInstruction({
                keys: [{ pubkey: gameAccount, isSigner: false, isWritable: true }, { pubkey: publicKey, isSigner: true }],
                programId: programID,
                data: WITHDRAW_INSTRUCTION_DISCRIMINATOR, // Withdraw instruction
            });

            const { blockhash } = await connection.getLatestBlockhash();
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: publicKey,
            }).add(instruction);

            const estimatedFee = await connection.getFeeForMessage(transaction.compileMessage());
            addLog(`Estimated fee for withdrawal: ${estimatedFee.value} lamports`);
            setEstimatedFee(estimatedFee.value);

            const signature = await sendTransaction(transaction, connection);
            addLog(`Withdrawal transaction confirmed with signature: ${signature}`);
            setLoading(false);
        } catch (error) {
            addLog('--- Error withdrawing funds ---');
            addLog(`Error details: ${error}`);
            setLoading(false);
        }
    };

    return (
        <div className="game-container p-8 bg-opacity-70 rounded-md shadow-lg bg-black max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-6 text-white">Click Game</h2>

            {/* Boutons */}
            <div className="text-center space-x-4">
                <button
                    onClick={initializeGame}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Init Game
                </button>
                <button
                    onClick={clickGame}
                    disabled={!gameAccount || loading}
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                    Click Game
                </button>
                <button
                    onClick={getGameInfo}
                    disabled={!gameAccount || loading}
                    className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-700"
                >
                    Get Game Info
                </button>
                <button
                    onClick={withdraw}
                    disabled={!gameAccount || loading}
                    className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                    Withdraw
                </button>
            </div>

            {/* Logs */}
            <div className="mt-6">
                {logs.map((log, index) => (
                    <div key={index} className="bg-gray-800 text-white p-2 my-2 rounded shadow-md">
                        {log}
                    </div>
                ))}
            </div>

            <p className="mt-6 text-white text-center">Estimated Fee: {estimatedFee ? `${estimatedFee} lamports` : 'Calculating...'}</p>
        </div>
    );
};

export default Game;
