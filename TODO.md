# TO-DO

## Tasks for Agents

- [x] When a prompt is generating, there is a load spinner animation that plays within the button that becomes a stop button upon hover. That spinner consumes ~20% of token speed. I would like it replaced with an animated ellipsis. It should be a simple animation that takes two seconds to loop these six text states: ['.  ','.. ','...',' ..','  .','   ']
- [x] Upgrade packages to or near the latest, especially playwright and svelte deps
- [x] Consider upgrading to the latest Node LTS if compatible with the upgraded packages (if it works, update .nvmrc and .node-version)
- [x] Update this files with a few tasks from the top of README.md
- [ ] Install and support pnpm as the project's package manager
- [ ] Make local llama.cpp a first-class citizen
- [ ] Streamline support for llama-swap - seamless multi-model via a single llama-server instance
- [ ] Add some nice-to-haves (in-line thinking toggle, AI-generated chat titles, etc)
- [ ] Write a companion script (bash/powershell/python) for managing llama-server and model downloads (from HuggingFace)
- [ ] Add web-compatible tools that models like Gemma 4 and Nemotron 3 can leverage (fetch, websearch, etc)
- [ ] Allow a chat to spawn sub-agents with their own unique prompts
- [ ] Support loading multiple models via multiple llama-server instances at once
- [ ] Support cross-chat communication for agent swarm workflows (i.e. Gemma and Nemotron collaboration)
