import { Button, Rows, Text, Alert } from "@canva/app-ui-kit";
import type { Joke } from '../types/joke.types';

interface JokeHistoryDisplayProps {
  jokes: Joke[];
  showHistory: boolean;
  onSelectJoke: (joke: string) => Promise<void>;
}

/**
 * Component responsible for displaying joke history
 * Follows Single Responsibility Principle
 */
export function JokeHistoryDisplay({ jokes, showHistory, onSelectJoke }: JokeHistoryDisplayProps) {
  if (!showHistory || jokes.length === 0) {
    return null;
  }

  const truncateJoke = (joke: string, maxLength: number = 50): string => {
    return joke.length > maxLength ? `${joke.substring(0, maxLength)}...` : joke;
  };

  return (
    <Alert tone="info">
      <Rows spacing="1u">
        <Text size="small"><strong>📚 Joke History - Click to reuse:</strong></Text>
        {jokes.map((joke) => {
          const displayText = truncateJoke(joke.content);
          return (
            <Button 
              key={joke.id}
              variant="secondary"
              onClick={() => onSelectJoke(joke.content)}
            >
              {displayText}
            </Button>
          );
        })}
      </Rows>
    </Alert>
  );
}
