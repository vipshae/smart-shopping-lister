import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import type { RequestHandler } from "./$types";
import { HUGGINGFACE_API_KEY } from "$env/static/private";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(HUGGINGFACE_API_KEY);

export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { prompt } = await request.json();
  const goodModel = "tiiuae/falcon-7b-instruct";

  const actualInput = `Imagine you are shopping for groceries. Can you suggest me three items which I should purchase along with ${prompt} ? Give only suggestion names in a numbered list. Do not include ${prompt} in the suggestions. Remove description text.`;

  const response = Hf.textGenerationStream({
    model: goodModel,
    inputs: actualInput,
    parameters: {
      max_new_tokens: 150,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 100,
      truncate: 200,
      return_full_text: false,
    },
  });

  const stream = HuggingFaceStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
