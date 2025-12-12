import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// -- Existing Breakdown --
export const breakdownTask = async (taskText: string): Promise<string[]> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [`Research ${taskText}`, `Draft outline for ${taskText}`, `Finalize review of ${taskText}`];
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the task "${taskText}" into 3 concise, actionable subtasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini breakdown failed:", error);
    return ["Analysis failed. Try again."];
  }
};

// -- Existing Prioritization --
export const prioritizeTasks = async (tasks: {id: string, text: string}[]): Promise<string[]> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [...tasks].sort((a, b) => b.text.length - a.text.length).map(t => t.id);
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert productivity manager. Prioritize the following tasks based on implied urgency, impact, and logical order. Return ONLY a JSON array of the IDs in the optimized order.
      Tasks: ${JSON.stringify(tasks.map(t => ({id: t.id, text: t.text})))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = response.text;
    if (!text) return tasks.map(t => t.id);
    return JSON.parse(text) as string[];
  } catch (error) {
    return tasks.map(t => t.id);
  }
};

// -- NEW: Context Aware Scheduling --
export interface ScheduleItem {
  time: string;
  taskId: string;
  reasoning: string;
}

export const generateSchedule = async (tasks: {id: string, text: string}[]): Promise<ScheduleItem[]> => {
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    // Mock schedule
    let hour = 9;
    return tasks.map(t => {
      const time = `${hour}:00 AM`;
      hour += 1;
      if (hour > 12) hour = 1;
      return { time, taskId: t.id, reasoning: "Scheduled based on optimal flow." };
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Plan a day starting at 9:00 AM for these tasks. 
      Consider context: put deep work (coding, writing) in the morning, and administrative tasks (email, calls) in the afternoon or between deep blocks.
      Return a JSON array of objects with 'time', 'taskId', and a short 'reasoning'.
      Tasks: ${JSON.stringify(tasks)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              taskId: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          }
        }
      }
    });
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ScheduleItem[];
  } catch (e) {
    console.error(e);
    return [];
  }
};