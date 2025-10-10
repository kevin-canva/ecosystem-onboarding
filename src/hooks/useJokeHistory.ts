import { useState } from 'react';
import type { Joke } from '../types/joke.types';

/**
 * Custom hook for managing joke history
 * Follows Single Responsibility Principle
 */
export function useJokeHistory(maxHistorySize: number = 10) {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const addJoke = (content: string) => {
    const newJoke: Joke = {
      id: Date.now().toString(),
      content,
      timestamp: new Date()
    };

    setJokes(prevJokes => [newJoke, ...prevJokes.slice(0, maxHistorySize - 1)]);
  };

  const clearHistory = () => {
    setJokes([]);
    setShowHistory(false);
  };

  const toggleHistoryDisplay = () => {
    setShowHistory(prev => !prev);
  };

  const getJokeById = (id: string): Joke | undefined => {
    return jokes.find(joke => joke.id === id);
  };

  return {
    jokes,
    showHistory,
    addJoke,
    clearHistory,
    toggleHistoryDisplay,
    getJokeById
  };
}
