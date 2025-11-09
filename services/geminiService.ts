import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";
import { DEFAULT_CATEGORIES } from "../constants";

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY environment variable not set. Gemini features will be disabled."
  );
}

export const categorizeTransaction = async (
  description: string
): Promise<string> => {
  if (!ai) return "Other";

  const allCategories = [
    ...DEFAULT_CATEGORIES.expense,
    ...DEFAULT_CATEGORIES.income,
  ];
  const prompt = `Given the transaction description "${description}", which of the following categories is the most appropriate? Please respond with only the category name. Categories: ${allCategories.join(
    ", "
  )}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const category = response.text.trim();
    return allCategories.includes(category) ? category : "Other";
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return "Other";
  }
};
