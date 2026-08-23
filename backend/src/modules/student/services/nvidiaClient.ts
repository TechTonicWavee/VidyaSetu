import OpenAI from 'openai';
import { aiConfig } from '../../../shared/config/ai.config';
import { env } from '../../../shared/config/env';

export const nvidiaClient = new OpenAI({
  apiKey: env.NVIDIA_API,
  baseURL: aiConfig.nvidiaBaseUrl,
});

export function extractionModel() {
  return aiConfig.models.extraction;
}

export function generationModel() {
  return aiConfig.models.generation;
}

export function embedModel() {
  return aiConfig.models.embedding;
}
