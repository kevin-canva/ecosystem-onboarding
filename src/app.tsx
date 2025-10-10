import { Button, Rows, Text, Title, Alert } from "@canva/app-ui-kit";
import { useAddElement } from "../utils/use_add_element";
import { useSelection } from "../utils/use_selection_hook";
import { useFeatureSupport } from "../utils/use_feature_support";
import { useState } from "react";
import * as styles from "styles/components.css";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

// JokeAPI response type
interface JokeApiResponse {
  error: boolean;
  joke?: string;
  setup?: string;
  delivery?: string;
  type: "single" | "twopart";
}

export const App = () => {
  const addElement = useAddElement();
  const isFeatureSupported = useFeatureSupport();
  
  // Selection hook to work with selected text elements
  const textSelection = useSelection("plaintext");
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [lastJoke, setLastJoke] = useState<string>("");
  const [jokeHistory, setJokeHistory] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState<'add' | 'replace'>('add');
  const [showHistory, setShowHistory] = useState(false);

  const fetchJoke = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single&safe-mode');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: JokeApiResponse = await response.json();
      
      if (data.error) {
        throw new Error('API returned an error');
      }
      
      if (data.type === 'single' && data.joke) {
        return data.joke;
      }
      
      throw new Error('No single-line joke found');
    } catch (error) {
      console.error('Error fetching joke:', error);
      return null;
    }
  };

  const handleAddJoke = async () => {
    setIsLoading(true);
    
    try {
      const joke = await fetchJoke();
      
      if (joke) {
        setLastJoke(joke);
        setJokeHistory(prev => [joke, ...prev.slice(0, 9)]); // Keep last 10 jokes
        
        // Add the joke as a text element to the Canva design
        await addElement({
          type: "text",
          children: [joke],
        });
      } else {
        // Fallback joke if API fails
        const fallbackJoke = "Why don't scientists trust atoms? Because they make up everything!";
        setLastJoke(fallbackJoke);
        setJokeHistory(prev => [fallbackJoke, ...prev.slice(0, 9)]);
        
        await addElement({
          type: "text",
          children: [fallbackJoke],
        });
      }
    } catch (error) {
      console.error('Error adding joke to design:', error);
      
      // Add error message as text if everything fails
      await addElement({
        type: "text",
        children: ["Sorry, couldn't fetch a joke right now! 😅"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceSelectedText = async () => {
    if (textSelection.count === 0) return;
    
    setIsLoading(true);
    
    try {
      const joke = await fetchJoke();
      if (!joke) return;
      
      const selectionContents = await textSelection.read();
      
      // Replace each selected text element with the joke
      for (const content of selectionContents.contents) {
        if (content.text !== undefined) {
          content.text = joke;
        }
      }
      
      await selectionContents.save();
      setLastJoke(joke);
      setJokeHistory(prev => [joke, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Error replacing selected text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJokeHistory = () => {
    setShowHistory(!showHistory);
  };

  const selectJokeFromHistory = async (joke: string) => {
    setLastJoke(joke);
    
    if (selectionMode === 'add') {
      await addElement({
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
    
    setShowHistory(false);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Rows spacing="1u">
          <Title>🎭 Advanced Joke Generator</Title>
          <Text>Multiple ways to add humor to your design!</Text>
          
          {/* Feature Support Info */}
          <Alert tone="info">
            <Text size="small">
              Features available: Selection ({textSelection.count} selected), 
              History ({jokeHistory.length} jokes stored)
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
        </Rows>

        {/* Mode Selection */}
        <Rows spacing="1u">
          <Text size="small"><strong>Select A Mode:</strong></Text>
          <Button 
            variant={selectionMode === 'add' ? 'primary' : 'secondary'}
            onClick={() => setSelectionMode('add')}
          >
            Add New Joke
          </Button>
          <Button 
            variant={selectionMode === 'replace' ? 'primary' : 'secondary'}
            onClick={() => setSelectionMode('replace')}
          >
            Replace Selected Text With Joke
          </Button>
        </Rows>

        {/* Action Buttons */}
        <Rows spacing="1u">
          <Text size="small"><strong>Click The Button To Make Magic Happen</strong></Text>
          {selectionMode === 'add' && (
            <Button 
              variant="primary" 
              onClick={handleAddJoke}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Fetching joke..." : "🎯 Add Random Joke"}
            </Button>
          )}
          
          {selectionMode === 'replace' && (
            <Button 
              variant="primary" 
              onClick={handleReplaceSelectedText}
              loading={isLoading}
              disabled={isLoading || textSelection.count === 0}
            >
              {isLoading 
                ? "Replacing..." 
                : textSelection.count > 0 
                  ? `🔄 Replace ${textSelection.count} Selected Text(s)`
                  : "Select text to replace"
              }
            </Button>
          )}
          
          {/* Joke History Button */}
          {jokeHistory.length > 0 && (
            <Button 
              variant="tertiary" 
              onClick={toggleJokeHistory}
            >
              {showHistory ? "🔙 Hide History" : "📚 View Joke History"}
            </Button>
          )}
        </Rows>

        {/* Selection Info */}
        {textSelection.count > 0 && (
          <Alert tone="positive">
            <Text size="small">
              🎯 {textSelection.count} text element(s) selected. 
              Switch to "Replace Selected Text" mode to replace them with jokes!
            </Text>
          </Alert>
        )}

        {/* Joke History Display */}
        {showHistory && jokeHistory.length > 0 && (
          <Alert tone="info">
            <Rows spacing="1u">
              <Text size="small"><strong>📚 Joke History - Click to reuse:</strong></Text>
              {jokeHistory.map((joke, index) => {
                const displayText = joke.length > 50 ? `${joke.substring(0, 50)}...` : joke;
                return (
                  <Button 
                    key={index}
                    variant="secondary"
                    onClick={() => selectJokeFromHistory(joke)}
                  >
                    {displayText}
                  </Button>
                );
              })}
            </Rows>
          </Alert>
        )}

        {/* Instructions */}
        <Rows spacing="1u">
          <Text size="small"><strong>💡 How to use:</strong></Text>
          <Text size="small">
            • <strong>Add Mode:</strong> Adds new joke text elements to your design<br/>
            • <strong>Replace Mode:</strong> Replaces selected text with jokes<br/>
            • <strong>History:</strong> View and reuse previous jokes from the list<br/>
            • Select text elements in your design to enable replace mode
          </Text>
        </Rows>
      </Rows>
    </div>
  );
};
