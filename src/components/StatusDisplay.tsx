import { Alert, Text } from "@canva/app-ui-kit";

interface StatusDisplayProps {
  selectedTextCount: number;
  historyLength: number;
  lastJoke?: string;
}

/**
 * Component responsible for displaying status information
 * Follows Single Responsibility Principle
 */
export function StatusDisplay({ selectedTextCount, historyLength, lastJoke }: StatusDisplayProps) {
  return (
    <>
      {/* Feature Support Info */}
      <Alert tone="info">
        <Text size="small">
          Features available: Selection ({selectedTextCount} selected), 
          History ({historyLength} jokes stored)
        </Text>
      </Alert>
      
      {/* Last Joke Display */}
      {lastJoke && (
        <Alert tone="positive">
          <Text>
            <strong>Latest:</strong> {lastJoke}
          </Text>
        </Alert>
      )}
      
      {/* Selection Info */}
      {selectedTextCount > 0 && (
        <Alert tone="positive">
          <Text size="small">
            🎯 {selectedTextCount} text element(s) selected. 
            Switch to "Replace Selected Text" mode to replace them with jokes!
          </Text>
        </Alert>
      )}
    </>
  );
}
