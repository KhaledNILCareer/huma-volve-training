import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export const generateProductInfo = async (name, shortDescription) => {
  const response = await ai.models.generateContent({
    model: 'models/gemini-3.6-flash',
    contents: `
      Generate product information based on the following input:

      Product name: ${name}
      Short description: ${shortDescription}
    `,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          description: {
            type: 'string'
          },
          category: {
            type: 'string'
          }
        },
        required: ['description', 'category']
      }
    }
  });

  return JSON.parse(response.text);
};
