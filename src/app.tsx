import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { useAddElement } from "../utils/use_add_element";
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
  const [isLoading, setIsLoading] = useState(false);
  const [lastJoke, setLastJoke] = useState<string>("");

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
        
        // Add the joke as a text element to the Canva design
        await addElement({
          type: "text",
          children: [joke],
        });
      } else {
        // Fallback joke if API fails
        const fallbackJoke = "Why don't scientists trust atoms? Because they make up everything!";
        setLastJoke(fallbackJoke);
        
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

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Rows spacing="1u">
          <Title>Joke Generator</Title>
          <Text>Click the button to fetch a random one-liner joke and add it to your design!</Text>
          {lastJoke && (
            <Text>
              <strong>Last joke:</strong> {lastJoke}
            </Text>
          )}
        </Rows>
        <Button 
          variant="primary" 
          onClick={handleAddJoke}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Fetching joke..." : "Add Random Joke"}
        </Button>
      </Rows>
    </div>
  );
};
