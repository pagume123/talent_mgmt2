export const POLICY_GENERATION_PROMPT = (content: string, archetype: string) => `
You are an expert HR consultant and linguist specializing in the Ethiopian corporate context.
Your task is to rewrite a company policy from English into professional Amharic.

CONTEXT:
English Policy Content: "${content}"
Company Archetype: "${archetype}"

INSTRUCTIONS:
1. Do not translate word-for-word. Instead, capture the core intent and adapt it to a professional Ethiopian corporate tone.
2. The Amharic should be modern and readable (avoid archaic phrasing unless it's a standard legal term).
3. Align the tone with the Company Archetype:
   - "Execution-First": The Amharic should be direct, clear, and slightly authoritative. Focus on clarity of action.
   - "Innovation-Led": The Amharic should be inspiring, flexible, and professional. Use language that suggests collaboration and creativity.
   - "Balanced": The Amharic should be standard, professional, and equitable.
4. If there are technical terms (e.g., "Performance Cycle", "Accrual"), provide the standard Amharic equivalent or a clear explanation in Amharic.

OUTPUT:
Only provide the rewritten Amharic text. No explanations or extra symbols.
`;
