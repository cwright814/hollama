<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import FieldHelp from '$lib/components/FieldHelp.svelte';
	import P from '$lib/components/P.svelte';
	import type { Server } from '$lib/connections';

	interface Props {
		server: Server;
	}

	let { server }: Props = $props();
	let isCopied = $state(false);
	const commandText = 'hf download bartowski/google_gemma-4-E4B-it-GGUF google_gemma-4-E4B-it-IQ4_NL.gguf --local-dir models';

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(commandText);
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		} catch (e) {
			// Ignore
		}
	}
</script>

<div class="mt-4 flex flex-col gap-y-2 rounded-md border border-shade-3 p-3 bg-shade-1">
	<P class="text-sm font-semibold">
		Models must be downloaded manually before starting llama-server.
	</P>
	<div class="flex items-center gap-x-2 rounded bg-shade-2 p-2">
		<code class="flex-1 overflow-x-auto text-xs font-mono text-muted">{commandText}</code>
		<Button
			aria-label="Copy download command"
			variant="outline"
			class="p-2"
			on:click={copyCommand}
		>
			{#if isCopied}
				<Check class="h-4 w-4 text-green-500" />
			{:else}
				<Copy class="h-4 w-4" />
			{/if}
		</Button>
	</div>
	<FieldHelp>
		<P class="text-xs text-muted">
			Make sure you have Hugging Face CLI installed (`curl -LsSf https://hf.co/cli/install.sh | bash`).
		</P>
	</FieldHelp>
</div>
