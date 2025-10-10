// Types and interfaces for joke-related functionality
export interface JokeApiResponse {
  error: boolean;
  joke?: string;
  setup?: string;
  delivery?: string;
  type: "single" | "twopart";
}

export interface Joke {
  id: string;
  content: string;
  timestamp: Date;
}

export type SelectionMode = 'add' | 'replace';

export interface JokeService {
  fetchJoke(): Promise<string | null>;
}

export interface JokeHistoryService {
  jokes: Joke[];
  addJoke(content: string): void;
  clearHistory(): void;
  getJokeById(id: string): Joke | undefined;
}
