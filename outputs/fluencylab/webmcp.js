const MODES = ["writing", "speaking"];
const CATEGORIES = ["Academic", "Workplace", "General Thinking"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

function enumDescription(values) {
  return values.map((value) => `"${value}"`).join(", ");
}

function normalizeEnum(value, values, fallback) {
  if (typeof value !== "string") return fallback;
  const match = values.find((item) => item.toLowerCase() === value.toLowerCase());
  return match || fallback;
}

function toolResult(text, structuredContent = {}) {
  return {
    content: [{ type: "text", text }],
    structuredContent
  };
}

export async function registerFluencyLabWebMcp(app) {
  const modelContext = document.modelContext || navigator.modelContext;

  if (!modelContext?.registerTool) {
    console.info("[FluencyLab WebMCP] document.modelContext is not available; human UI remains active.");
    return { available: false, registered: 0 };
  }

  window.fluencyLabWebMcpController?.abort();
  const controller = new AbortController();
  window.fluencyLabWebMcpController = controller;

  const tools = [
    {
      name: "generate_practice_prompt",
      description: `Configure FluencyLab and show a practice exercise in the normal UI. Use this when a user wants a communication drill. Allowed mode values: ${enumDescription(MODES)}. Allowed category values: ${enumDescription(CATEGORIES)}. Allowed difficulty values: ${enumDescription(DIFFICULTIES)}.`,
      inputSchema: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: MODES,
            description: "Whether the user should practice a written response or a spoken response."
          },
          category: {
            type: "string",
            enum: CATEGORIES,
            description: "The communication context for the exercise."
          },
          difficulty: {
            type: "string",
            enum: DIFFICULTIES,
            description: "The level of structure and pressure for the drill."
          },
          focus: {
            type: "string",
            description: "Optional natural-language user goal, such as interview practice or disagreeing professionally."
          }
        },
        required: ["mode", "category", "difficulty"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false },
      async execute(input) {
        const mode = normalizeEnum(input?.mode, MODES, "writing");
        const category = normalizeEnum(input?.category, CATEGORIES, "Workplace");
        const difficulty = normalizeEnum(input?.difficulty, DIFFICULTIES, "Intermediate");
        const prompt = app.generatePracticePrompt({ mode, category, difficulty });

        return toolResult(
          `FluencyLab is showing a ${difficulty} ${category} ${mode} exercise.`,
          { prompt, focus: input?.focus || "" }
        );
      }
    },
    {
      name: "analyze_response",
      description: "Analyze a user's current or supplied FluencyLab response using the same feedback logic as the human UI. Use this after the user writes or dictates an answer. This does not require authentication and does not save guest data to Supabase.",
      inputSchema: {
        type: "object",
        properties: {
          response: {
            type: "string",
            minLength: 1,
            description: "The user's written response or speaking transcript to analyze."
          }
        },
        required: ["response"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false },
      async execute(input) {
        if (!input?.response || typeof input.response !== "string") {
          throw new TypeError("response must be a non-empty string.");
        }

        const feedback = app.analyzeResponse(input.response);
        return toolResult(
          `Feedback ready. Overall score ${feedback.overall}/10.`,
          { feedback }
        );
      }
    },
    {
      name: "retry_prompt",
      description: "Return the user to the current FluencyLab exercise, clear the response workspace, and keep the same prompt visible so they can try again. Use this when the user wants another attempt at the same scenario.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false
      },
      annotations: { readOnlyHint: false },
      async execute() {
        const prompt = app.retryCurrentPrompt();
        return toolResult(
          "FluencyLab reopened the current prompt for another attempt.",
          { prompt }
        );
      }
    }
  ];

  await Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal: controller.signal })));
  console.info(`[FluencyLab WebMCP] Registered ${tools.length} tools.`);
  return { available: true, registered: tools.length };
}
