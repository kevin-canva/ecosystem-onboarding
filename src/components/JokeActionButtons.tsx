import { Button, Rows, Text } from "@canva/app-ui-kit";
import type { SelectionMode } from '../types/joke.types';

interface JokeActionButtonsProps {
  selectionMode: SelectionMode;
  isLoading: boolean;
  selectedTextCount: number;
  historyLength: number;
  onAddJoke: () => Promise<void>;
  onReplaceSelectedText: () => Promise<void>;
  onToggleHistory: () => void;
  showHistory: boolean;
}

/**
 * Component responsible for action buttons UI
 * Follows Single Responsibility and Open/Closed Principles
 */
export function JokeActionButtons({
  selectionMode,
  isLoading,
  selectedTextCount,
  historyLength,
  onAddJoke,
  onReplaceSelectedText,
  onToggleHistory,
  showHistory
}: JokeActionButtonsProps) {
  const getButtonText = () => {
    if (isLoading) {
      return selectionMode === 'add' ? "Fetching joke..." : "Replacing...";
    }
    
    if (selectionMode === 'add') {
      return "🎯 Add Random Joke";
    }
    
    if (selectedTextCount > 0) {
      return `🔄 Replace ${selectedTextCount} Selected Text(s)`;
    }
    
    return "Select text to replace";
  };

  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (selectionMode === 'replace' && selectedTextCount === 0) return true;
    return false;
  };

  const handleButtonClick = () => {
    return selectionMode === 'add' ? onAddJoke() : onReplaceSelectedText();
  };

  return (
    <Rows spacing="1u">
      <Text size="small"><strong>Click The Button To Make Magic Happen</strong></Text>
      
      <Button 
        variant="primary" 
        onClick={handleButtonClick}
        loading={isLoading}
        disabled={isButtonDisabled()}
      >
        {getButtonText()}
      </Button>
      
      {historyLength > 0 && (
        <Button 
          variant="tertiary" 
          onClick={onToggleHistory}
        >
          {showHistory ? "🔙 Hide History" : "📚 View Joke History"}
        </Button>
      )}
    </Rows>
  );
}
