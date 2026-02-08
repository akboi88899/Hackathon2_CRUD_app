import { HttpAgent } from "@ag-ui/client";
import axios from 'axios';

export class AdkAgent extends HttpAgent {
  private ADK_BACKEND: string;

  constructor(options: { url: string; adkBackend: string }) {
    super({ url: options.url });
    this.ADK_BACKEND = options.adkBackend;
  }

  // Override the client property to provide custom state management
  client = {
    threads: {
      getState: async (threadId: string) => {
        console.log('Fetching state for threadId:', threadId);

        try {
          // Make the API call to get agent state
          const response = await axios.get(`${this.ADK_BACKEND}/agents/state`, {
            params: { threadId },
            headers: {
              'accept': 'application/json'
            }
          });

          console.log('State fetched successfully:', response.data);

          // Return in the expected format
          return {
            values: response.data
          };

        } catch (error) {
          console.error('Error fetching state:', error);

          // Return empty state on error
          return {
            values: {
              messages: [],
              state: {}
            }
          };
        }
      },

      // Add update state method if needed
      updateState: async (threadId: string, values: any) => {
        console.log('Updating state for threadId:', threadId);
        
        try {
          const response = await axios.post(`${this.ADK_BACKEND}/agents/state`, {
            threadId,
            values
          }, {
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json'
            }
          });

          console.log('State updated successfully');
          return response.data;

        } catch (error) {
          console.error('Error updating state:', error);
          throw error;
        }
      }
    }
  };
}
