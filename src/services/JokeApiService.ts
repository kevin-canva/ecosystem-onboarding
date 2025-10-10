import type { JokeService, JokeApiResponse } from '../types/joke.types';

/**
 * Service responsible for fetching jokes from external API
 * Follows Single Responsibility Principle
 */
export class JokeApiService implements JokeService {
  private readonly apiUrl = 'https://v2.jokeapi.dev/joke/Any?type=single&safe-mode';
  private readonly fallbackJoke = "Why don't scientists trust atoms? Because they make up everything!";

  async fetchJoke(): Promise<string | null> {
    try {
      const response = await this.makeApiCall();
      const data = await this.parseResponse(response);
      return this.extractJoke(data);
    } catch (error) {
      console.error('Error fetching joke:', error);
      return this.fallbackJoke;
    }
  }

  private async makeApiCall(): Promise<Response> {
    const response = await fetch(this.apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  }

  private async parseResponse(response: Response): Promise<JokeApiResponse> {
    return await response.json();
  }

  private extractJoke(data: JokeApiResponse): string {
    if (data.error) {
      throw new Error('API returned an error');
    }
    
    if (data.type === 'single' && data.joke) {
      return data.joke;
    }
    
    throw new Error('No single-line joke found');
  }
}
