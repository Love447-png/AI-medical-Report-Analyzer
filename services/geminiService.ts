import { GoogleGenAI, Type } from "@google/genai";
import { type AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, one-paragraph overview of the report's main points in simple, patient-friendly terms."
        },
        keyFindings: {
            type: Type.ARRAY,
            description: "A list of key medical findings extracted from the report.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { 
                        type: Type.STRING, 
                        description: "The medical term or finding from the report (e.g., 'Spina bifida S1')." 
                    },
                    explanation: { 
                        type: Type.STRING, 
                        description: "A simple, easy-to-understand explanation of what the term means for a non-medical person." 
                    }
                },
                required: ["term", "explanation"]
            }
        },
        potentialProblems: {
            type: Type.ARRAY,
            description: "A list of potential health issues or conditions suggested by the findings. This must be phrased as possibilities, not definitive diagnoses. For example, 'May contribute to lower back pain' instead of 'You have lower back pain'.",
            items: {
                type: Type.STRING
            }
        },
        recommendedActions: {
            type: Type.ARRAY,
            description: "A list of general, non-prescriptive next steps for the patient. Emphasize consultation with a doctor. For instance, 'Discuss these findings with your referring doctor or an orthopedic specialist.' or 'Ask your doctor about physical therapy options.'",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["summary", "keyFindings", "potentialProblems", "recommendedActions"]
};

export async function analyzeMedicalReport(base64Image: string, mimeType: string): Promise<AnalysisResult> {
    const prompt = `
        Analyze the provided medical report. Your role is to act as a helpful AI assistant that simplifies complex medical information for a patient.
        Follow these instructions carefully:
        1.  Extract all key medical findings mentioned in the report.
        2.  For each finding, provide a simple, easy-to-understand explanation. Avoid overly technical jargon.
        3.  Based on the collective findings, list potential problems or symptoms a person might experience. Frame these as possibilities, not certainties.
        4.  Suggest general next steps or measures a patient should take. Crucially, all suggestions must point towards consulting a qualified healthcare professional. Do not provide any medical advice or diagnosis.
        5.  Return the entire analysis in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Image,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedJson.summary || !Array.isArray(parsedJson.keyFindings)) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedJson as AnalysisResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
}