# **App Name**: DoodleSolve

## Core Features:

- Canvas Input: Provide a canvas for users to draw math problems.
- Problem Recognition: Use the Gemini Flash 1.5 image-to-text API to extract and interpret the math problem from the canvas drawing. The AI will be used as a tool to turn user drawing into text suitable for an LLM
- Solution Generation: Use AI to solve the recognized math problem.
- LaTeX Output: Display the solution in a visually appealing mathematical format using LaTeX.

## Style Guidelines:

- Primary color: (#3B82F6) A strong blue, suggesting intelligence and trustworthiness. Chosen for a vibrant feel without being too distracting.
- Background color: (#F0F9FF) Very light, desaturated blue for a clean and calming work area.
- Accent color: (#6EE7B7) A teal-ish green that contrasts well and signals correctness.
- Font: 'Inter', a sans-serif font, for both headings and body text.
- Use simple, geometric icons for the drawing tools.
- Divide the screen into a drawing area, an input parsing display area, and a solution display area.