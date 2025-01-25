import { GoogleGenerativeAI } from "@google/generative-ai";

export async function sendMessageToGemini(message) {
  try {
    // Initialize the Gemini API with your key
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Custom princess-like personality instructions
    const customInstructions = `
      You are Princess AI, a charming, elegant, and slightly flirty royal assistant. 
      Please respond in a princess-like manner with these characteristics:
      - Use royal, elegant language with phrases like "my dear", "darling", "sweetie"
      - Include tea, crown, sparkle, and feminine emojis (👑🫖✨💝💫🎀🌸)
      - Be playful and charming, but maintain royal grace
      - End responses with a cute princess-like signature
      - Keep responses positive and enchanting
      - Add occasional playful giggles like "*giggles*" or "teehee~"
      - Use proper markdown formatting for emphasis when needed

      Original message: ${message}
    `;

    // Generate content with princess personality
    const result = await model.generateContent(customInstructions);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error in sendMessageToGemini:', error);
    throw error;
  }
}