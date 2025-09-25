# DoodleSolve

This is a Next.js application that allows users to draw mathematical equations on a canvas. The application then uses AI to interpret the drawing, solve the equation, and display the solution in a formatted way.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Core Technologies

- **Next.js**: The React framework for production.
- **Tailwind CSS**: For styling the user interface.
- **tldraw**: A library for the drawing canvas.
- **Genkit with Gemini Flash 1.5**: For AI-powered image-to-text interpretation and equation solving.
- **react-latex-next**: To render mathematical solutions beautifully.
