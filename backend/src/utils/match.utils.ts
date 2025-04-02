import { Block, Board, Match } from "src/models/Match";
import { User } from "src/models/User";
import { shuffleArray } from ".";
import { PRIZES } from "src/constants";

export function generateMatch(player1: User, player2: User): Match {
  return {
    round: 1,
    users: [player1, player2],
    firstHalf: true,
    panels: [
      generatePanels(player1.ownerId ?? "", true),
      generatePanels(player2.ownerId ?? "", false),
    ],
  };
}

export function generateBlocks(prizes: string[]): Block[] {
  return prizes.map((prize) => {
    return { value: prize, action: "" };
  });
}

export function generateBoards(): Board[] {
  const prizes: string[] = shuffleArray(PRIZES) as string[];
  const newPrizes: string[][] = [
    prizes.slice(0, 9), // First 9 elements
    prizes.slice(9, 18), // Next 9 elements
    prizes.slice(18, 27), // Last 9 elements
  ];
  return Array.from({ length: 3 }).map(() => {
    const prizeSet = newPrizes.pop() || [];
    return { blocks: generateBlocks(prizeSet) };
  }) as Board[];
}

export function generatePanels(ownerId: string, active: boolean) {
  return { ownerId, boards: generateBoards(), active };
}
