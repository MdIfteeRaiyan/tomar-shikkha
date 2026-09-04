"use client";

import { useMemo, useState } from "react";
import { Brain, Gift, Grid3X3, PartyPopper, RotateCcw, ShoppingBag, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sudokuPuzzles = [
  { puzzle: [1, 0, 0, 4, 0, 4, 1, 0, 0, 1, 4, 0, 4, 0, 0, 1], solution: [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1] },
  { puzzle: [0, 3, 0, 1, 1, 0, 4, 0, 0, 4, 0, 2, 2, 0, 1, 0], solution: [4, 3, 2, 1, 1, 2, 4, 3, 3, 4, 1, 2, 2, 1, 3, 4] },
];

export function BreakZone({ onBack, powerStars, redemptions, onRedeem }: { onBack: () => void; powerStars: number; redemptions: { rewardId: string }[]; onRedeem: (rewardId: string, cost: number) => boolean }) {
  return <div className="shell play-page"><div className="play-hero"><div><p className="eyebrow">BRAIN BREAK</p><h1>Break Zone 🎮</h1><p>কিছুক্ষণ খেলো, brain refresh করো, তারপর নতুন energy নিয়ে practice-এ ফিরে যাও।</p></div><div className="break-actions"><span><Star size={17} fill="currentColor" /> {powerStars} Power Stars</span><Button variant="outline" onClick={onBack}>Practice-এ ফিরি</Button></div></div><Tabs defaultValue="sudoku" className="game-tabs"><TabsList className="game-tab-list"><TabsTrigger value="sudoku"><Grid3X3 /> Mini Sudoku</TabsTrigger><TabsTrigger value="tictactoe"><Sparkles /> Tic-Tac-Toe</TabsTrigger><TabsTrigger value="star-shop"><Gift /> Star Shop</TabsTrigger></TabsList><TabsContent value="sudoku"><SudokuGame /></TabsContent><TabsContent value="tictactoe"><TicTacToe /></TabsContent><TabsContent value="star-shop"><StarShop powerStars={powerStars} redemptions={redemptions} onRedeem={onRedeem} /></TabsContent></Tabs></div>;
}

const virtualRewards = [
  { id: "candy", emoji: "🍬", name: "Magic Candy", cost: 50, note: "একটি sweet collection badge" },
  { id: "chocolate", emoji: "🍫", name: "Choco Bar", cost: 80, note: "Virtual chocolate treat" },
  { id: "teddy", emoji: "🧸", name: "Study Buddy", cost: 180, note: "তোমার virtual teddy friend" },
  { id: "car", emoji: "🏎️", name: "Rocket Car", cost: 250, note: "Super-fast toy car" },
  { id: "robot", emoji: "🤖", name: "Smart Robot", cost: 400, note: "Rare collection reward" },
  { id: "crown", emoji: "👑", name: "Champion Crown", cost: 600, note: "সবচেয়ে special learner reward" },
];

function StarShop({ powerStars, redemptions, onRedeem }: { powerStars: number; redemptions: { rewardId: string }[]; onRedeem: (rewardId: string, cost: number) => boolean }) {
  const [message, setMessage] = useState("Practice করে Stars জমাও, তারপর পছন্দের virtual reward unlock করো!");
  const counts = useMemo(() => redemptions.reduce<Record<string, number>>((result, reward) => ({ ...result, [reward.rewardId]: (result[reward.rewardId] ?? 0) + 1 }), {}), [redemptions]);
  const redeem = (reward: typeof virtualRewards[number]) => {
    if (!onRedeem(reward.id, reward.cost)) { setMessage(`আর ${reward.cost - powerStars} Stars পেলেই ${reward.name} unlock হবে।`); return; }
    setMessage(`${reward.emoji} Yay! ${reward.name} তোমার collection-এ যোগ হয়েছে!`);
  };
  return <section className="shop-card"><div className="shop-head"><div><span className="game-icon gold"><ShoppingBag /></span><p className="eyebrow">100% VIRTUAL • NO REAL MONEY</p><h2>Star Shop</h2><p>{message}</p></div><div className="shop-balance"><Star size={20} fill="currentColor" /><strong>{powerStars}</strong><span>Stars available</span></div></div><div className="reward-grid">{virtualRewards.map((reward) => { const owned = counts[reward.id] ?? 0; const affordable = powerStars >= reward.cost; return <article key={reward.id} className={affordable ? "ready" : "locked"}><span className="reward-emoji">{reward.emoji}</span>{owned > 0 && <span className="owned-count">Owned ×{owned}</span>}<h3>{reward.name}</h3><p>{reward.note}</p><button onClick={() => redeem(reward)} disabled={!affordable}><Star size={14} fill="currentColor" /> {affordable ? `${reward.cost} Stars দিয়ে নাও` : `${reward.cost - powerStars} Stars বাকি`}</button></article>; })}</div><p className="virtual-note"><Gift size={16} /> এগুলো শুধু TomarShikkha-এর virtual collection—বাস্তব chocolate, candy বা toy দেওয়া হবে না।</p></section>;
}

function SudokuGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = sudokuPuzzles[puzzleIndex];
  const [board, setBoard] = useState(puzzle.puzzle);
  const [selected, setSelected] = useState(1);
  const [message, setMessage] = useState("প্রতিটি সারি, কলাম ও 2×2 ঘরে 1–4 একবার করে বসাও।");
  const fixed = puzzle.puzzle;
  const updateCell = (index: number) => { if (fixed[index]) return; const next = [...board]; next[index] = selected; setBoard(next); setMessage("এগিয়ে যাও—তুমি পারবে!"); };
  const reset = () => { setBoard([...puzzle.puzzle]); setMessage("আবার শুরু হলো—চলো চেষ্টা করি!"); };
  const newPuzzle = () => { const nextIndex = (puzzleIndex + 1) % sudokuPuzzles.length; setPuzzleIndex(nextIndex); setBoard([...sudokuPuzzles[nextIndex].puzzle]); setMessage("নতুন puzzle তৈরি!"); };
  const check = () => { if (board.some((value) => value === 0)) setMessage("আরও কিছু ঘর বাকি আছে 👀"); else if (board.every((value, index) => value === puzzle.solution[index])) setMessage("দারুণ! Sudoku solved 🏆"); else setMessage("প্রায় হয়ে গেছে—কিছু সংখ্যা আবার দেখো।"); };
  return <section className="game-card"><div className="game-copy"><span className="game-icon"><Brain /></span><p className="eyebrow">LOGIC QUEST • 4×4</p><h2>Mini Sudoku</h2><p>{message}</p></div><div className="sudoku-layout"><div className="sudoku-grid" aria-label="4 by 4 Sudoku board">{board.map((value, index) => <button key={index} className={fixed[index] ? "fixed" : ""} onClick={() => updateCell(index)} aria-label={`Row ${Math.floor(index / 4) + 1}, column ${(index % 4) + 1}${value ? `, ${value}` : ", empty"}`}>{value || ""}</button>)}</div><div className="number-tools"><span>একটি সংখ্যা বেছে নাও</span><div>{[1, 2, 3, 4].map((number) => <button key={number} className={selected === number ? "active" : ""} onClick={() => setSelected(number)}>{number}</button>)}</div><Button onClick={check}>মিলিয়ে দেখি</Button><button className="game-link" onClick={reset}><RotateCcw /> আবার শুরু</button><button className="game-link" onClick={newPuzzle}><Sparkles /> নতুন puzzle</button></div></div></section>;
}

type Cell = "X" | "O" | null;
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const getWinner = (board: Cell[]) => { for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; return board.every(Boolean) ? "draw" : null; };
const bestMove = (board: Cell[]) => {
  const open = board.map((cell, index) => cell ? -1 : index).filter((index) => index >= 0);
  for (const mark of ["O", "X"] as const) for (const index of open) { const copy = [...board]; copy[index] = mark; if (getWinner(copy) === mark) return index; }
  if (board[4] === null) return 4;
  return [0,2,6,8,1,3,5,7].find((index) => board[index] === null) ?? -1;
};

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [wins, setWins] = useState(0);
  const result = useMemo(() => getWinner(board), [board]);
  const play = (index: number) => {
    if (board[index] || result) return;
    const next = [...board]; next[index] = "X";
    const playerResult = getWinner(next);
    if (playerResult === "X") { setBoard(next); setWins((value) => value + 1); return; }
    if (!playerResult) { const move = bestMove(next); if (move >= 0) next[move] = "O"; }
    setBoard(next);
  };
  const reset = () => setBoard(Array(9).fill(null));
  const status = result === "X" ? "তুমি জিতেছ—দারুণ চাল! 🏆" : result === "O" ? "Computer জিতেছে—আবার খেলবে? 🤖" : result === "draw" ? "Match draw—দুজনই ভালো খেলেছ! 🤝" : "তুমি X—এবার তোমার চাল!";
  return <section className="game-card"><div className="game-copy"><span className="game-icon coral"><PartyPopper /></span><p className="eyebrow">QUICK MATCH</p><h2>Tic-Tac-Toe</h2><p>{status}</p><span className="win-counter">তোমার জয়: <strong>{wins}</strong></span></div><div className="ttt-wrap"><div className="ttt-grid" aria-label="Tic-Tac-Toe board">{board.map((cell, index) => <button key={index} className={cell ? `mark-${cell.toLowerCase()}` : ""} onClick={() => play(index)} aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ", empty"}`}>{cell}</button>)}</div><Button onClick={reset}><RotateCcw /> {result ? "আবার খেলি" : "Restart"}</Button></div></section>;
}
