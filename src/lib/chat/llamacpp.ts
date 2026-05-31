import OpenAI from 'openai';
import type {
	ChatCompletionContentPart,
	ChatCompletionMessageParam
} from 'openai/resources/index.mjs';

import type { Server } from '$lib/connections';
import type { Model } from '$lib/settings';

import type { ChatRequest, ChatStrategy, Message } from './index';

export interface LlamaCppOptions {
	temperature?: number;
	top_k?: number;
	top_p?: number;
	min_p?: number;
	typical_p?: number;
	xtc_probability?: number;
	xtc_threshold?: number;
	dynatemp_range?: number;
	dynatemp_exponent?: number;
	mirostat?: number;
	mirostat_tau?: number;
	mirostat_eta?: number;
	presence_penalty?: number;
	frequency_penalty?: number;
	repeat_penalty?: number;
	repeat_last_n?: number;
	dry_multiplier?: number;
	dry_base?: number;
	dry_allowed_length?: number;
	dry_penalty_last_n?: number;
	adaptive_target?: number;
	adaptive_decay?: number;
	seed?: number;
	stop?: string[];
	max_tokens?: number;
}

export class LlamaCppStrategy implements ChatStrategy {
	private openai: OpenAI;

	constructor(private server: Server) {
		this.openai = new OpenAI({
			baseURL: this.server.baseUrl,
			apiKey: this.server.apiKey || '',
			dangerouslyAllowBrowser: true
		});
	}

	async chat(
		payload: ChatRequest,
		abortSignal: AbortSignal,
		onChunk: (content: string) => void
	): Promise<void> {
		const formattedMessages = payload.messages.map(
			(message: Message): ChatCompletionMessageParam => {
				if (message.images && message.images.length > 0) {
					const content: ChatCompletionContentPart[] = [{ type: 'text', text: message.content }];
					message.images.forEach((img) => {
						let mimeType = 'image/jpeg';
						let base64Data = img;
						const dataUrlMatch = img.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.*)$/);
						if (dataUrlMatch) {
							mimeType = dataUrlMatch[1];
							base64Data = dataUrlMatch[2];
						}
						content.push({
							type: 'image_url',
							image_url: {
								url: `data:${mimeType};base64,${base64Data}`
							}
						});
					});
					return { role: 'user' as const, content };
				} else {
					if (message.role === 'user') {
						return { role: 'user', content: message.content };
					} else if (message.role === 'assistant') {
						return { role: 'assistant', content: message.content };
					} else {
						return { role: 'system', content: message.content };
					}
				}
			}
		);

		// Extract custom sampling parameters from options if present
		const samplingParams: Record<string, any> = {};
		if (payload.options) {
			const opts = payload.options as LlamaCppOptions;
			if (opts.temperature !== undefined) samplingParams.temperature = opts.temperature;
			if (opts.top_k !== undefined) samplingParams.top_k = opts.top_k;
			if (opts.top_p !== undefined) samplingParams.top_p = opts.top_p;
			if (opts.min_p !== undefined) samplingParams.min_p = opts.min_p;
			if (opts.typical_p !== undefined) samplingParams.typical_p = opts.typical_p;
			if (opts.xtc_probability !== undefined) samplingParams.xtc_probability = opts.xtc_probability;
			if (opts.xtc_threshold !== undefined) samplingParams.xtc_threshold = opts.xtc_threshold;
			if (opts.dynatemp_range !== undefined) samplingParams.dynatemp_range = opts.dynatemp_range;
			if (opts.dynatemp_exponent !== undefined) samplingParams.dynatemp_exponent = opts.dynatemp_exponent;
			if (opts.mirostat !== undefined) samplingParams.mirostat = opts.mirostat;
			if (opts.mirostat_tau !== undefined) samplingParams.mirostat_tau = opts.mirostat_tau;
			if (opts.mirostat_eta !== undefined) samplingParams.mirostat_eta = opts.mirostat_eta;
			if (opts.presence_penalty !== undefined) samplingParams.presence_penalty = opts.presence_penalty;
			if (opts.frequency_penalty !== undefined) samplingParams.frequency_penalty = opts.frequency_penalty;
			if (opts.repeat_penalty !== undefined) samplingParams.repeat_penalty = opts.repeat_penalty;
			if (opts.repeat_last_n !== undefined) samplingParams.repeat_last_n = opts.repeat_last_n;
			if (opts.dry_multiplier !== undefined) samplingParams.dry_multiplier = opts.dry_multiplier;
			if (opts.dry_base !== undefined) samplingParams.dry_base = opts.dry_base;
			if (opts.dry_allowed_length !== undefined) samplingParams.dry_allowed_length = opts.dry_allowed_length;
			if (opts.dry_penalty_last_n !== undefined) samplingParams.dry_penalty_last_n = opts.dry_penalty_last_n;
			if (opts.adaptive_target !== undefined) samplingParams.adaptive_target = opts.adaptive_target;
			if (opts.adaptive_decay !== undefined) samplingParams.adaptive_decay = opts.adaptive_decay;
			if (opts.seed !== undefined) samplingParams.seed = opts.seed;
			if (opts.stop !== undefined) samplingParams.stop = opts.stop;
			if (opts.max_tokens !== undefined) samplingParams.max_tokens = opts.max_tokens;
		}

		const response = await this.openai.chat.completions.create({
			model: payload.model,
			messages: formattedMessages,
			stream: true,
			...samplingParams
		} as any);

		for await (const chunk of response) {
			if (abortSignal.aborted) break;
			onChunk(chunk.choices[0].delta.content || '');
		}
	}

	async getModels(): Promise<Model[]> {
		const response = await this.openai.models.list();
		return response.data
			?.filter((model) => model.id.startsWith(this.server.modelFilter || ''))
			.map((model) => ({
				serverId: this.server.id,
				name: model.id
			}));
	}

	async verifyServer(): Promise<boolean> {
		try {
			await this.getModels();
			return true;
		} catch {
			return false;
		}
	}
}
