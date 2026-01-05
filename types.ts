export enum GameStatus {
  START_SCREEN = 'START_SCREEN',
  LEVEL_INTRO = 'LEVEL_INTRO',
  PLAYING = 'PLAYING',
  LEVEL_VICTORY = 'LEVEL_VICTORY',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  QUIZ = 'QUIZ'
}

export interface GameResources {
  soldiers: number; // Health equivalent
  supplies: number; // Food/Ammo
  morale: number;   // Willpower
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  poemLine: string;
  backgroundUrl: string;
  objective: string;
}

export interface LevelProps {
  resources: GameResources;
  onUpdateResources: (newResources: GameResources | ((prev: GameResources) => GameResources)) => void;
  onComplete: () => void;
  onFail: (reason: string) => void;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}