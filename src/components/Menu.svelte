<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	// @ts-nocheck
	export let onClearBoard;
	export let onStart;
	export let onGenerateMaze;
	export let onAlgorithmChange;
	export let onClearPath;
	export let onAnimationSpeedChange;
	let animationSpeed = 2; // Default speed value

	const algorithms = { a_star: 'A* Search', bfs: 'Breadth-First Search' };
	let selectedAlgorithm;
	function handleAlgorithmChange() {
		// @ts-ignore
		onAlgorithmChange(selectedAlgorithm); //
	}
	function handleAnimationSpeedChange() {
		onAnimationSpeedChange(animationSpeed);
	}

	onMount(() => {
		onAlgorithmChange(selectedAlgorithm);
		onAnimationSpeedChange(animationSpeed);
	});
</script>

<div class="menu">
	<h2 class="menu-title">Pathfinding Visualizer</h2>

	<button on:click={onGenerateMaze}>Create Maze</button>
	<button on:click={onStart}>Start Pathfinding</button>
	<button on:click={onClearBoard}>Clear Grid</button>
	<button on:click={onClearPath}>Clear Route</button>
	<select class="algorithm" bind:value={selectedAlgorithm} on:change={handleAlgorithmChange}>
		{#each Object.entries(algorithms) as [value, name]}
			<option {value}>{name}</option>
		{/each}
	</select>
	<label for="animation-speed-slider" class="slider-label">Animation Speed</label>

	<input
		id="animation-speed-slider"
		type="range"
		min="1"
		max="15"
		bind:value={animationSpeed}
		on:change={handleAnimationSpeedChange}
		class="animation-speed-slider"
	/>
</div>

<style>
	.menu {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		background-color: #fff; /* White background */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
		border-radius: 8px; /* Rounded corners */
		margin-bottom: 10px;
	}

	.menu-title {
		font-size: 24px;
		color: #202124; /* Google's primary text color */
		margin-bottom: 20px;
		width: 100%; /* Full width */
		text-align: center;
	}

	.menu button,
	.menu .algorithm,
	.menu .animation-speed-slider {
		background-color: #e8eaed; /* Light grey background */
		color: #202124; /* Dark text color */
		border: none;
		padding: 10px 15px;
		margin: 5px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 16px;
		transition: background-color 0.2s;
	}

	.menu button:hover,
	.menu .algorithm:hover {
		background-color: #d2e3fc; /* Slightly darker on hover */
	}

	.menu button:active {
		background-color: #aecbfa; /* Even darker on active */
	}

	.menu .algorithm {
		cursor: pointer;
		outline: none;
	}

	.slider-label {
		margin-right: 10px;
		font-size: 16px;
		color: #202124; /* Consistent text color */
	}

	.animation-speed-slider {
		flex-grow: 1; /* Allows the slider to grow and fill available space */
		max-width: 200px; /* Maximum width of the slider */
		margin-left: 10px;
		cursor: pointer;
		outline: none;
		-webkit-appearance: none; /* Override default appearance */
	}

	/* Thumb of the slider */
	.animation-speed-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #4285f4; /* Google blue for the slider thumb */
		border-radius: 50%;
		cursor: pointer;
	}

	.animation-speed-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #4285f4;
		border-radius: 50%;
		cursor: pointer;
	}
</style>
