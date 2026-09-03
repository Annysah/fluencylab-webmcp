# FluencyLab

FluencyLab is a scenario-based communication practice app for writing and speaking under light time pressure. It helps users practice clearer thinking, structured responses, and workplace-ready articulation.

For the WebMCP Challenge, FluencyLab exposes a small set of its existing practice capabilities to AI agents so a user can move from a natural-language communication goal into an interactive practice session.

## Live Demo

https://fluencylab-webmcp.vercel.app/

## Source Code

https://github.com/Annysah/fluencylab-webmcp

## What It Does

- Writing practice with workplace, academic, and general thinking prompts.
- Speaking simulation with browser microphone recording where supported.
- Difficulty controls for beginner, intermediate, and advanced drills.
- Optional timed practice.
- Structured feedback with clarity, structure, confidence, vocabulary, and an improved sample answer.
- Practice history and progress for signed-in users.
- Guest practice-to-feedback flow without requiring an account.

## Why WebMCP

Without WebMCP, the user manually opens FluencyLab, chooses a mode, selects a category and difficulty, generates a prompt, writes a response, and submits it.

With WebMCP, an AI agent can understand a user's goal, configure FluencyLab through agent-discoverable tools, and update the same visible practice interface the human uses.

The goal is not to create a separate chatbot. The goal is to let an agent orchestrate FluencyLab's existing structured practice flow.

## Human + Agent Demo Flow

Suggested demo prompt:

```text
I have an interview tomorrow. Help me practice explaining my experience clearly and concisely.
```

Expected flow:

1. The agent discovers FluencyLab's WebMCP tools.
2. The agent invokes `generate_practice_prompt`.
3. FluencyLab visibly opens the Practice screen with a configured prompt.
4. The user writes a response in the normal response workspace.
5. The agent invokes `analyze_response`.
6. FluencyLab visibly opens the Feedback screen with scores and suggestions.
7. The agent can invoke `retry_prompt` to return the user to the same exercise.

## WebMCP Tools

### `generate_practice_prompt`

Configures and displays a FluencyLab practice exercise.

Inputs:

- `mode`: `writing` or `speaking`
- `category`: `Academic`, `Workplace`, or `General Thinking`
- `difficulty`: `Beginner`, `Intermediate`, or `Advanced`
- `focus`: optional natural-language goal

Visible effect:

- Updates the normal FluencyLab Practice screen.
- Selects the requested mode, category, and difficulty.
- Displays a matching prompt.

### `analyze_response`

Analyzes a written response or speaking transcript using FluencyLab's existing feedback logic.

Inputs:

- `response`: the user's response text

Visible effect:

- Places the response in the workspace.
- Runs the existing analysis logic.
- Opens the Feedback screen with score breakdown and improvement notes.

### `retry_prompt`

Returns the user to the current exercise for another attempt.

Visible effect:

- Clears the response workspace.
- Keeps the current prompt.
- Opens the Practice screen.

## Architecture

FluencyLab is currently a static HTML/CSS/JavaScript PWA.

Main app files:

- `outputs/fluencylab/index.html`
- `outputs/fluencylab/webmcp.js`
- `outputs/fluencylab/supabase-config.js`
- `outputs/fluencylab/sw.js`
- `outputs/fluencylab/manifest.webmanifest`

The WebMCP implementation is a progressive enhancement. In browsers where `document.modelContext` is unavailable, the app continues to work normally for human users.

## Existing Project / Challenge Work

FluencyLab existed before the WebMCP Challenge. The baseline commit is:

```text
0349504 chore: preserve pre-WebMCP FluencyLab baseline
```

Pre-challenge functionality included the static PWA, landing page, writing and speaking practice modes, local prompt bank, timer controls, browser `MediaRecorder` support, heuristic feedback, feedback/history/dashboard screens, Supabase authentication, Supabase-backed practice session persistence, Terms/Privacy pages, and Vercel deployment configuration.

Challenge work added:

- Guest writing practice to feedback flow without requiring authentication.
- WebMCP integration through `document.modelContext.registerTool`.
- Three agent-discoverable FluencyLab tools.
- Agent-controlled prompt/session configuration.
- WebMCP-triggered response analysis.
- UI synchronization between agent actions and the normal human interface.

## Running Locally

From the project root:

```bash
npm start
```

Then open:

```text
http://127.0.0.1:4173/index.html
```

## Testing Guest Practice

1. Open `http://127.0.0.1:4173/index.html#practice` locally or `https://fluencylab-webmcp.vercel.app/#practice` in production.
2. Stay signed out.
3. Keep mode set to Writing.
4. Enter a response.
5. Click `Get feedback`.
6. Confirm the app opens the Feedback screen.
7. Confirm no sign-in modal appears.

## Testing WebMCP

Use ChatGPT's in-app browser or another browser/agent environment that supports the current WebMCP API on `document.modelContext`.

Suggested agent prompt:

```text
Open FluencyLab and use its WebMCP tools. I have an interview tomorrow. Help me practice explaining my experience clearly and concisely.
```

Manual discovery:

```js
await document.modelContext.getTools()
```

Invoke prompt generation:

```js
const tools = await document.modelContext.getTools();
await document.modelContext.executeTool(
  tools.find((tool) => tool.name === "generate_practice_prompt"),
  {
    mode: "writing",
    category: "Workplace",
    difficulty: "Intermediate",
    focus: "Interview practice"
  }
);
```

Invoke analysis:

```js
const tools = await document.modelContext.getTools();
await document.modelContext.executeTool(
  tools.find((tool) => tool.name === "analyze_response"),
  {
    response: "I would explain my experience by starting with the result, then naming the skills I used, and closing with how that experience prepares me for the role."
  }
);
```

Invoke retry:

```js
const tools = await document.modelContext.getTools();
await document.modelContext.executeTool(
  tools.find((tool) => tool.name === "retry_prompt"),
  {}
);
```

## Deployment

The project is configured for Vercel static deployment.

Settings:

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `outputs/fluencylab`

The root `vercel.json` already points Vercel to the static output directory.

## Privacy / Data

Guest users can practice and receive feedback without creating an account. Guest feedback is temporary and is not saved to Supabase.

Signed-in users can save practice sessions and history through the configured Supabase project.

The Supabase key in `outputs/fluencylab/supabase-config.js` is a publishable browser key. No service role key should be committed.

## Known Limitations

- Prompt generation is currently local and array-based.
- Feedback is heuristic JavaScript logic, not OpenAI/API-generated feedback.
- Speaking analysis does not include speech-to-text or filler-word detection.
- Audio is recorded for local playback only and is not uploaded.
- Server-side authentication and backend validation are not implemented in this static prototype.
- Automated tests are not yet included.

## License

This project is licensed under the MIT License.
