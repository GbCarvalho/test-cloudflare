export default {
  async fetch(request, env) {
    const audioResponse = await fetch(
      'https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call6_mono_16k_az_apply_loan.wav'
    );
    const blob = await audioResponse.arrayBuffer();

    const inputs = {
      audio: [...new Uint8Array(blob)]
    };
    const response = await env.AI.run('@cf/openai/whisper', inputs);

    return Response.json({ response });
  }
};
