import { Button, Rows, Text } from "@canva/app-ui-kit";
import type { SelectionMode } from '../types/joke.types';

interface JokeModeSelectorProps {
  selectionMode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
}

/**
 * Component responsible for mode selection UI
 * Follows Single Responsibility Principle
 */
export function JokeModeSelector({ selectionMode, onModeChange }: JokeModeSelectorProps) {
  return (
    <Rows spacing="1u">
      <Text size="small"><strong>Select A Mode:</strong></Text>
      <Button 
        variant={selectionMode === 'add' ? 'primary' : 'secondary'}
        onClick={() => onModeChange('add')}
      >
        Add New Joke
      </Button>
      <Button 
        variant={selectionMode === 'replace' ? 'primary' : 'secondary'}
        onClick={() => onModeChange('replace')}
      >
        Replace Selected Text With Joke
      </Button>
    </Rows>
  );
}
