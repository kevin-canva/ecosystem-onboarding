import { useState } from 'react';
import { JokeApiService } from '../services/JokeApiService';
import type { JokeService } from '../types/joke.types';

/**
 * Custom hook for joke fetching functionality
 * Encapsulates loading state and error handling
 */
export function useJokeFetcher(jokeService: JokeService = new JokeApiService()) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchJoke = async (): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const joke = await jokeService.fetchJoke();
      return joke;
    } catch (error) {
      console.error('Error in joke fetcher:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchJoke
  };
}
