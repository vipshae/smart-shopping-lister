import { InferenceClient } from "@huggingface/inference";
import { createTextStreamResponse } from "ai";
import type { RequestHandler } from "./$types";
import { HUGGINGFACE_API_KEY } from "$env/static/private";

// Create a new HuggingFace Inference instance
const hf = new InferenceClient(HUGGINGFACE_API_KEY);

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { prompt } = await request.json();
  const goodModel = "tiiuae/falcon-7b-instruct";

  const actualInput = `Imagine you are shopping for groceries. Can you suggest me three items which I should purchase along with ${prompt} ? Give only suggestion names in a numbered list. Do not include ${prompt} in the suggestions. Remove description text.`;

  const response = hf.textGenerationStream({
    model: goodModel,
    inputs: actualInput,
    parameters: {
      max_new_tokens: 150,
      typical_p: 0.2,
      repetition_penalty: 100,
      truncate: 200,
      return_full_text: false,
    },
  });

  const stream = new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const chunk of response) {
          if (!chunk.token.special) controller.enqueue(chunk.token.text);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return createTextStreamResponse({ stream });
}) satisfies RequestHandler;
