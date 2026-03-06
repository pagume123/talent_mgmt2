import { GoogleGenerativeAI } from "@google/generative-ai";
import { POLICY_GENERATION_PROMPT } from "@/lib/ai/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local",
                hint: "Ensure you have added the key to .env.local and restarted your dev server."
            }, { status: 500 });
        }

        const { content, archetype } = await req.json();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Initialize inside the handler to ensure fresh environment variable access
        const genAI = new GoogleGenerativeAI(apiKey);

        // Comprehensive fallback chain starting with the successful Lite model
        const modelsToTry = [
            "gemini-2.5-flash-lite",
            "gemini-2.0-flash-lite-preview-02-05",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-pro"
        ];
        const prompt = POLICY_GENERATION_PROMPT(content, archetype || "compliance-first");

        let lastError = null;
        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();

                if (text) {
                    return NextResponse.json({ amharic: text, model: modelName });
                }
            } catch (err: any) {
                console.warn(`${modelName} failed:`, err.message);
                lastError = err;
                continue;
            }
        }

        throw lastError;

    } catch (error: any) {
        console.error("Policy generation final error:", error);

        let errorMessage = error.message || "Failed to generate policy";
        const isQuota = errorMessage.includes("429") || errorMessage.includes("quota");
        const is404 = errorMessage.includes("404");

        if (isQuota) {
            errorMessage = "Gemini Quota Exceeded (429). This usually means your free tier isn't provisioned yet for this key/region (Limit: 0). Try a fresh key from AI Studio.";
        } else if (is404) {
            errorMessage = "All Gemini models (2.5/2.0/1.5/1.0) returned 404. Your API Key might be restricted to a specific defunct project. Please create a NEW project in Google AI Studio.";
        }

        return NextResponse.json({
            error: errorMessage,
            details: error.message,
            hint: "Check https://aistudio.google.com/ to ensure your key has access to these specific models."
        }, { status: 500 });
    }
}
