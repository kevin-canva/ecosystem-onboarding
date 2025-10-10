import type { TextElement } from "@canva/design";
import type { SelectionMode } from '../types/joke.types';

/**
 * Service responsible for managing joke operations with Canva elements
 * Follows Single Responsibility and Dependency Inversion Principles
 */
export class JokeManagerService {
  async addJokeToDesign(
    joke: string, 
    addElement: (element: TextElement) => Promise<void> | undefined
  ): Promise<void> {
    const result = addElement({
      type: "text",
      children: [joke],
    });
    
    if (result) {
      await result;
    }
  }

  async replaceSelectedTextWithJoke(
    joke: string,
    selectionContents: { contents: Array<{ text?: string }>, save: () => Promise<void> }
  ): Promise<void> {
    for (const content of selectionContents.contents) {
      if (content.text !== undefined) {
        content.text = joke;
      }
    }
    
    await selectionContents.save();
  }

  async executeJokeAction(
    mode: SelectionMode,
    joke: string,
    addElement: (element: TextElement) => Promise<void> | undefined,
    textSelection: { count: number; read: () => Promise<any> }
  ): Promise<void> {
    if (mode === 'add') {
      await this.addJokeToDesign(joke, addElement);
    } else if (mode === 'replace' && textSelection.count > 0) {
      const selectionContents = await textSelection.read();
      await this.replaceSelectedTextWithJoke(joke, selectionContents);
    }
  }
}
