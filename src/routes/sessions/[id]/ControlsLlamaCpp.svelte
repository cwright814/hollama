<script lang="ts">
	import LL from '$i18n/i18n-svelte';
	import FieldCheckbox from '$lib/components/FieldCheckbox.svelte';
	import FieldInput from '$lib/components/FieldInput.svelte';
	import Fieldset from '$lib/components/Fieldset.svelte';
	import P from '$lib/components/P.svelte';
	import { loadKnowledge } from '$lib/knowledge';
	import { knowledgeStore } from '$lib/localStorage';
	import type { Session } from '$lib/sessions';

	import KnowledgeSelect from './KnowledgeSelect.svelte';

	const DEFAULT_TEMPERATURE = '0.8';
	const DEFAULT_TOP_K = '40';
	const DEFAULT_TOP_P = '0.95';
	const DEFAULT_MIN_P = '0.05';
	const DEFAULT_TYPICAL_P = '1.0';
	const DEFAULT_XTC_PROBABILITY = '0.0';
	const DEFAULT_XTC_THRESHOLD = '0.1';
	const DEFAULT_PRESENCE_PENALTY = '0.0';
	const DEFAULT_FREQUENCY_PENALTY = '0.0';
	const DEFAULT_REPEAT_PENALTY = '1.0';
	const DEFAULT_REPEAT_LAST_N = '64';
	const DEFAULT_SEED = $LL.random();
	const DEFAULT_STOP = $LL.automatic();
	const DEFAULT_MAX_TOKENS = '512';

	interface Props {
		session: Session;
	}

	let { session = $bindable() }: Props = $props();

	// HACK: Stop is a `string[]` so we are hardcoding it to a single value for now
	let stop: string = $state(session.options.stop?.[0] ?? '');
	let knowledgeId: string | undefined = $state();

	$effect(() => {
		if (stop) session.options.stop = [stop];
	});

	$effect(() => {
		if (session.systemPrompt.knowledge && !knowledgeId) {
			// Initial load: set knowledgeId if knowledge exists
			knowledgeId = session.systemPrompt.knowledge.id;
		} else if (knowledgeId !== session.systemPrompt.knowledge?.id) {
			// Knowledge selection changed
			if (knowledgeId) {
				const knowledge = loadKnowledge(knowledgeId);
				session.systemPrompt.knowledge = knowledge;
				session.systemPrompt.content = knowledge.content;
			} else {
				// Clear knowledge if knowledgeId is undefined
				session.systemPrompt.knowledge = undefined;
				session.systemPrompt.content = '';
			}
		}
	});
</script>

<div class="controls">
	<Fieldset>
		<P><strong>{$LL.systemPrompt()}</strong></P>
		<KnowledgeSelect bind:value={knowledgeId} bind:options={$knowledgeStore} showNav={true} />
	</Fieldset>

	<Fieldset>
		<P><strong>{$LL.modelOptions()}</strong></P>
		<div class="control-inputs">
			<FieldInput
				name="seed"
				label={$LL.seed()}
				type="number"
				min={0}
				step={1}
				placeholder={DEFAULT_SEED}
				bind:value={session.options.seed}
			/>
			<FieldInput
				name="max_tokens"
				label={$LL.maxTokens()}
				type="number"
				min={1}
				step={1}
				placeholder={DEFAULT_MAX_TOKENS}
				bind:value={session.options.max_tokens}
			/>
			<FieldInput
				name="temperature"
				label={$LL.temperature()}
				type="number"
				min={0}
				max={2}
				step={0.1}
				placeholder={DEFAULT_TEMPERATURE}
				bind:value={session.options.temperature}
			/>
			<FieldInput
				name="top_k"
				label={$LL.topK()}
				type="number"
				min={1}
				step={1}
				placeholder={DEFAULT_TOP_K}
				bind:value={session.options.top_k}
			/>
			<FieldInput
				name="top_p"
				label={$LL.topP()}
				type="number"
				min={0}
				max={1}
				step={0.05}
				placeholder={DEFAULT_TOP_P}
				bind:value={session.options.top_p}
			/>
			<FieldInput
				name="min_p"
				label={$LL.minP()}
				type="number"
				min={0}
				max={1}
				step={0.01}
				placeholder={DEFAULT_MIN_P}
				bind:value={session.options.min_p}
			/>
			<FieldInput
				name="typical_p"
				label={$LL.typicalP()}
				type="number"
				min={0}
				max={1}
				step={0.01}
				placeholder={DEFAULT_TYPICAL_P}
				bind:value={session.options.typical_p}
			/>
			<FieldInput
				name="xtc_probability"
				label={$LL.xtcProbability()}
				type="number"
				min={0}
				max={1}
				step={0.05}
				placeholder={DEFAULT_XTC_PROBABILITY}
				bind:value={session.options.xtc_probability}
			/>
			<FieldInput
				name="xtc_threshold"
				label={$LL.xtcThreshold()}
				type="number"
				min={0}
				max={2}
				step={0.05}
				placeholder={DEFAULT_XTC_THRESHOLD}
				bind:value={session.options.xtc_threshold}
			/>
			<FieldInput
				name="repeat_last_n"
				label={$LL.repeatLastN()}
				type="number"
				min={-1}
				step={1}
				placeholder={DEFAULT_REPEAT_LAST_N}
				bind:value={session.options.repeat_last_n}
			/>
			<FieldInput
				name="repeat_penalty"
				label={$LL.repeatPenalty()}
				type="number"
				step={0.1}
				placeholder={DEFAULT_REPEAT_PENALTY}
				bind:value={session.options.repeat_penalty}
			/>
			<FieldInput
				name="presence_penalty"
				label={$LL.presencePenalty()}
				type="number"
				step={0.01}
				placeholder={DEFAULT_PRESENCE_PENALTY}
				bind:value={session.options.presence_penalty}
			/>
			<FieldInput
				name="frequency_penalty"
				label={$LL.frequencyPenalty()}
				type="number"
				step={0.01}
				placeholder={DEFAULT_FREQUENCY_PENALTY}
				bind:value={session.options.frequency_penalty}
			/>
			<FieldInput
				name="stop"
				label={$LL.stop()}
				type="text"
				placeholder={DEFAULT_STOP}
				bind:value={stop}
			/>
		</div>
	</Fieldset>
</div>

<style lang="postcss">
	.controls {
		@apply base-fieldset-container flex h-full flex-col gap-y-6 overflow-scroll;
		@apply md:gap-y-8;
	}

	.control-inputs {
		@apply grid grid-cols-2 gap-2;
	}
</style>
