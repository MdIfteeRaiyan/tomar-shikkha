"use client";

import { useMemo, useState } from "react";
import { Brain, Grid3X3, PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sudokuPuzzles = [
  { puzzle: [1, 0, 0, 4, 0, 4, 1, 0, 0, 1, 4, 0, 4, 0, 0, 1], solution: [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1] },
  { puzzle: [0, 3, 0, 1, 1, 0, 4, 0, 0, 4, 0, 2, 2, 0, 1, 0], solution: [4, 3, 2, 1, 1, 2, 4, 3, 3, 4, 1, 2, 2, 1, 3, 4] },
];

export function PlayZone({ onBack }: { onBack: () => void }) {
  return <div className="shell play-page"><div className="play-hero"><div><p className="eyebrow">BRAIN BREAK</p><h1>Play Zone 🎮</h1><p>কিছুক্ষণ খেলো, logic sharpen করো, তারপর fresh mind-এ পড়ায় ফিরে যাও।</p></div><Button variant="outline" onClick={onBack}>Back to Practice</Button></div><Tabs defaultValue="sudoku" className="game-tabs"><TabsList className="game-tab-list"><TabsTrigger value="sudoku"><Grid3X3 /> Mini Sudoku</TabsTrigger><TabsTrigger value="tictactoe"><Sparkles /> Tic-Tac-Toe</TabsTrigger></TabsList><TabsContent value="sudoku"><SudokuGame /></TabsContent><TabsContent value="tictactoe"><TicTacToe /></TabsContent></Tabs></div>;
}

function SudokuGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = sudokuPuzzles[puzzleIndex];
  const [board, setBoard] = useState(puzzle.puzzle);
  const [selected, setSelected] = useState(1);
  const [message, setMessage] = useState("প্রতিটি row, column ও 2×2 box-এ 1–4 একবার করে বসাও।");
  const fixed = puzzle.puzzle;
  const updateCell = (index: number) => { if (fixed[index]) return; const next = [...board]; next[index] = selected; setBoard(next); setMessage("Keep going—তুমি পারবে!"); };
  const reset = () => { setBoard([...puzzle.puzzle]); setMessage("Board reset—আবার try করো!"); };
  const newPuzzle = () => { const nextIndex = (puzzleIndex + 1) % sudokuPuzzles.length; setPuzzleIndex(nextIndex); setBoard([...sudokuPuzzles[nextIndex].puzzle]); setMessage("New puzzle ready!"); };
  const check = () => { if (board.some((value) => value === 0)) setMessage("আরও কিছু ঘর বাকি আছে 👀"); else if (board.every((value, index) => value === puzzle.solution[index])) setMessage("Brilliant! Sudoku solved 🏆"); else setMessage("Almost there—কিছু number আবার দেখো।"); };
  return <section className="game-card"><div className="game-copy"><span className="game-icon"><Brain /></span><p className="eyebrow">LOGIC QUEST • 4×4</p><h2>Mini Sudoku</h2><p>{message}</p></div><div className="sudoku-layout"><div className="sudoku-grid" aria-label="4 by 4 Sudoku board">{board.map((value, index) => <button key={index} className={fixed[index] ? "fixed" : ""} onClick={() => updateCell(index)} aria-label={`Row ${Math.floor(index / 4) + 1}, column ${(index % 4) + 1}${value ? `, ${value}` : ", empty"}`}>{value || ""}</button>)}</div><div className="number-tools"><span>Choose a number</span><div>{[1, 2, 3, 4].map((number) => <button key={number} className={selected === number ? "active" : ""} onClick={() => setSelected(number)}>{number}</button>)}</div><Button onClick={check}>Check Puzzle</Button><button className="game-link" onClick={reset}><RotateCcw /> Reset</button><button className="game-link" onClick={newPuzzle}><Sparkles /> New puzzle</button></div></div></section>;
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
  const status = result === "X" ? "You win—awesome move! 🏆" : result === "O" ? "Computer wins—rematch? 🤖" : result === "draw" ? "It’s a draw—well played! 🤝" : "You are X. Make your move!";
  return <section className="game-card"><div className="game-copy"><span className="game-icon coral"><PartyPopper /></span><p className="eyebrow">QUICK MATCH</p><h2>Tic-Tac-Toe</h2><p>{status}</p><span className="win-counter">Your wins: <strong>{wins}</strong></span></div><div className="ttt-wrap"><div className="ttt-grid" aria-label="Tic-Tac-Toe board">{board.map((cell, index) => <button key={index} className={cell ? `mark-${cell.toLowerCase()}` : ""} onClick={() => play(index)} aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ", empty"}`}>{cell}</button>)}</div><Button onClick={reset}><RotateCcw /> {result ? "Play Again" : "Restart"}</Button></div></section>;
}
