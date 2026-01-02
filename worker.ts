import { Buffer } from "node:buffer";
import type { Ai } from "workers-ai";
import lodash from "lodash";

const mediaUrl = "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav";

export interface Env {
  AI: Ai;
}

/**
 * Transcribes a single media chunk using the Whisper‑large‑v3‑turbo model.
 * The function converts the media chunk to a Base64-encoded string and
 * sends it to the model via the AI binding.
 *
 * @param chunkBuffer - The media chunk as an ArrayBuffer.
 * @param env - The Cloudflare Worker environment, including the AI binding.
 * @returns The transcription text from the model.
 */
async function transcribeChunk(
  chunkBuffer: ArrayBuffer,
  env: Env,
): Promise<string> {
  const base64 = Buffer.from(chunkBuffer, "binary").toString("base64");

  // Optional parameters (uncomment and set if needed):
  // task: "transcribe",   // or "translate"
  // language: "en",
  // vad_filter: "false",
  // initial_prompt: "Provide context if needed.",
  // prefix: "Transcription:",
  const res = await env.AI.run("@cf/openai/whisper-large-v3-turbo", {
    audio: base64,
    task: "transcribe",
    vad_filter: true,
  });
  return res;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const media: ArrayBuffer = await fetch(mediaUrl).then(res => res.arrayBuffer())

    const transcription = await transcribeChunk(media, env);

    return Response.json({ response: transcription });
  }
};
