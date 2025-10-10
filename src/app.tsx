import { Rows, Title } from "@canva/app-ui-kit";
import { useAddElement } from "../utils/use_add_element";
import { useSelection } from "../utils/use_selection_hook";
import { useFeatureSupport } from "../utils/use_feature_support";
import { useState } from "react";
import * as styles from "styles/components.css";
import { useJokeFetcher } from "./hooks/useJokeFetcher";
import { useJokeHistory } from "./hooks/useJokeHistory";
import { JokeModeSelector } from "./components/JokeModeSelector";
import { JokeActionButtons } from "./components/JokeActionButtons";
import { JokeHistoryDisplay } from "./components/JokeHistoryDisplay";
import { StatusDisplay } from "./components/StatusDisplay";
import { InstructionsDisplay } from "./components/InstructionsDisplay";
import { JokeManagerService } from "./services/JokeManagerService";
import type { SelectionMode } from "./types/joke.types";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

export const App = () => {
  const addElement = useAddElement();
  const textSelection = useSelection("plaintext");
  
  const { isLoading, fetchJoke } = useJokeFetcher();
  const { 
    jokes, 
    showHistory, 
    addJoke, 
    toggleHistoryDisplay 
  } = useJokeHistory();
  
  const jokeManager = new JokeManagerService();
  
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('add');
  const [lastJoke, setLastJoke] = useState<string>("");

  const safeAddElement = async (element: any): Promise<void> => {
    const result = addElement(element);
    if (result) {
      await result;
    }
  };

  const handleJokeAction = async (mode: SelectionMode = selectionMode) => {
    try {
      const joke = await fetchJoke();
      
      if (!joke) {
        throw new Error('Failed to fetch joke');
      }

      if (mode === 'add') {
        await safeAddElement({
          type: "text",
          children: [joke],
        });
      } else if (mode === 'replace' && textSelection.count > 0) {
        const selectionContents = await textSelection.read();
        
        for (const content of selectionContents.contents) {
          if (content.text !== undefined) {
            content.text = joke;
          }
        }
        
        await selectionContents.save();
      }
      
      setLastJoke(joke);
      addJoke(joke);
      
    } catch (error) {
      console.error('Error in joke action:', error);
      
      await safeAddElement({
        type: "text",
        children: ["Sorry, couldn't fetch a joke right now! 😅"],
      });
    }
  };

  const handleAddJoke = () => handleJokeAction('add');
  const handleReplaceSelectedText = () => handleJokeAction('replace');

  const handleSelectJokeFromHistory = async (joke: string) => {
    try {
      if (selectionMode === 'add') {
        await safeAddElement({
          type: "text",
          children: [joke],
        });
      } else if (selectionMode === 'replace' && textSelection.count > 0) {
        const selectionContents = await textSelection.read();
        
        for (const content of selectionContents.contents) {
          if (content.text !== undefined) {
            content.text = joke;
          }
        }
        
        await selectionContents.save();
      }
      
      setLastJoke(joke);
      toggleHistoryDisplay();
    } catch (error) {
      console.error('Error selecting joke from history:', error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Rows spacing="1u">
          <Title>🎭 Advanced Joke Generator</Title>
          
          <StatusDisplay 
            selectedTextCount={textSelection.count}
            historyLength={jokes.length}
            lastJoke={lastJoke}
          />
        </Rows>

        <JokeModeSelector 
          selectionMode={selectionMode}
          onModeChange={setSelectionMode}
        />

        <JokeActionButtons 
          selectionMode={selectionMode}
          isLoading={isLoading}
          selectedTextCount={textSelection.count}
          historyLength={jokes.length}
          onAddJoke={handleAddJoke}
          onReplaceSelectedText={handleReplaceSelectedText}
          onToggleHistory={toggleHistoryDisplay}
          showHistory={showHistory}
        />

        <JokeHistoryDisplay 
          jokes={jokes}
          showHistory={showHistory}
          onSelectJoke={handleSelectJokeFromHistory}
        />

        <InstructionsDisplay />
      </Rows>
    </div>
  );
};
