import { Rows, Text } from "@canva/app-ui-kit";

/**
 * Component responsible for displaying usage instructions
 * Follows Single Responsibility Principle
 */
export function InstructionsDisplay() {
  return (
    <Rows spacing="1u">
      <Text size="small"><strong>💡 How to use:</strong></Text>
      <Text size="small">
        • <strong>Add Mode:</strong> Adds new joke text elements to your design<br/>
        • <strong>Replace Mode:</strong> Replaces selected text with jokes<br/>
        • <strong>History:</strong> View and reuse previous jokes from the list<br/>
        • Select text elements in your design to enable replace mode
      </Text>
    </Rows>
  );
}
