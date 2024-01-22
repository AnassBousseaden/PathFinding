<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	import Grid from './Grid.svelte';
	import Menu from './Menu.svelte';
	import { algorithms, generateObstacles } from './path-finding';

	const cellSize = 25;
	// manage container mount
	let animationSpeed;
	let gridContainer;
	let row_length;
	let col_length;
	let grid;
	let algorithm;
	let currentTimerId;
	let isReadyToRender = false;
	// states: idle,moving_start,moving_end,placing_walls,animating
	// actions : mouse_down,mouse_up,mouse_move
	let isDragging = false;
	let currentState = 'IDLE';
	// The representation of the grid [0:empty,1:obstacle]
	let startNode; // { rowIndex: 0, colIndex: 0 }
	let endNode; // { rowIndex: 4, colIndex: 4 }
	// state management Functions
	const handleDown = function (e) {
		if (currentState != 'IDLE') return;
		const { rowIndex, colIndex } = e.detail;
		isDragging = true;
		if (rowIndex == startNode.rowIndex && colIndex == startNode.colIndex)
			currentState = 'MOVING_START';
		else if (rowIndex == endNode.rowIndex && colIndex == endNode.colIndex)
			currentState = 'MOVING_END';
		else currentState = 'PLACING_WALLS';
		handleMove(e);
	};

	const handleUp = function () {
		if (isDragging) {
			currentState = 'IDLE';
			isDragging = false;
		}
	};

	const handleMove = function (e) {
		const { rowIndex, colIndex } = e.detail;
		if (isDragging) {
			if (currentState == 'MOVING_START') {
				startNode.rowIndex = rowIndex;
				startNode.colIndex = colIndex;
				// trigger reactivity
				startNode = startNode;
			} else if (currentState == 'MOVING_END') {
				endNode.rowIndex = rowIndex;
				endNode.colIndex = colIndex;
				// trigger reactivity
				endNode = endNode;
			} else {
				grid[rowIndex][colIndex] = 1;
				// trigger reactivity
				grid = [...grid];
			}
		}
	};

	// menu Actions management

	function requestClearBoard() {
		if (currentState == 'ANIMATING') {
			currentState = 'IDLE';
			cancelAnimationFrame(currentTimerId);
		}
		clearBoard();
	}

	function requestAnimationSpeedChange(speed) {
		console.log('Animation Speed:', speed);
		animationSpeed = speed;
		// Use the speed value as needed
	}

	function requestClearPath() {
		if (currentState == 'ANIMATING') {
			currentState = 'IDLE';
			cancelAnimationFrame(currentTimerId);
		}
		clearPath();
	}

	function requestPathFinding() {
		if (currentState != 'IDLE') return;
		clearPath();
		currentState = 'ANIMATING';
		const graph = grid.map((row) => row.slice());
		const path_find = algorithms[algorithm];
		const [path, cells] = path_find(startNode, endNode, graph);
		animatePathfinding(path, cells);
	}

	function requestGenerateMaze() {
		// Generate maze logic
		if (currentState != 'IDLE') return;
		currentState = 'ANIMATING';
		clearBoard();
		const walls = generateObstacles(grid.length, grid[0].length, startNode, endNode);
		animateMaze(walls);
	}

	function requestChangeAlgorithm(selectedAlgorithm) {
		// Handle algorithm change
		algorithm = selectedAlgorithm;
	}

	// animation function
	function animatePathfinding(path, cells) {
		const animateExploration = function () {
			if (indexExploration < cells.length) {
				const steps = animationSpeed;
				for (let i = 0; i < steps && indexExploration + i < cells.length; ++i) {
					const [x, y] = cells[indexExploration + i];
					grid[y][x] = 2; // Mark as 'exploring'
				}
				grid = [...grid]; // Trigger Svelte's reactivity
				indexExploration += steps;
				currentTimerId = requestAnimationFrame(animateExploration);
			} else {
				currentTimerId = requestAnimationFrame(animatePath);
			}
		};

		const animatePath = function () {
			if (indexPath < path.length) {
				const steps = 1;
				for (let i = 0; i < steps && indexPath + i < path.length; ++i) {
					const [x, y] = path[indexPath + i];
					grid[y][x] = 3; // Mark as 'path'
				}
				grid = [...grid]; // Trigger Svelte's reactivity
				indexPath += steps;
				currentTimerId = requestAnimationFrame(animatePath);
			} else {
				currentState = 'IDLE';
				cancelAnimationFrame(currentTimerId); // Stop the animation
			}
		};

		let animationFrameId;
		let indexExploration = 0;
		let indexPath = 0;
		animateExploration();
		return animationFrameId;
	}

	function animateMaze(walls) {
		let indexWalls = 0;
		let animateWalls = function () {
			if (indexWalls >= walls.length) {
				currentState = 'IDLE';
				return;
			}

			const steps = animationSpeed;
			for (let i = 0; i < steps && indexWalls + i < walls.length; ++i) {
				let [rowIndex, colIndex] = walls[indexWalls + i];
				grid[rowIndex][colIndex] = 1;
			}
			grid = [...grid];
			indexWalls += steps;
			currentTimerId = requestAnimationFrame(animateWalls);
		};
		currentTimerId = animateWalls();
	}

	// utils
	function clearBoard() {
		for (let row = 0; row < row_length; row++) {
			for (let col = 0; col < col_length; col++) {
				grid[row][col] = 0;
			}
		}
		grid = [...grid]; // Trigger Svelte's reactivity system
	}
	function clearPath() {
		for (let row = 0; row < row_length; row++) {
			for (let col = 0; col < col_length; col++) {
				if (grid[row][col] >= 2) grid[row][col] = 0;
			}
		}
		grid = [...grid]; // Trigger Svelte's reactivity system
	}

	function updateDimensions() {
		if (!gridContainer) return;
		const { width, height } = gridContainer.getBoundingClientRect();
		col_length = Math.floor(width / cellSize);
		row_length = Math.floor(height / cellSize);
		isReadyToRender = true;
	}

	// Grid generation management
	onMount(() => {
		updateDimensions();
		grid = Array.from({ length: row_length }, () => new Array(col_length).fill(0));
		const startX = Math.floor(col_length / 3),
			startY = Math.floor(row_length / 2);
		const endX = 2 * startX,
			endY = startY;
		startNode = { rowIndex: startY, colIndex: startX }; //
		endNode = { rowIndex: endY, colIndex: endX }; //
	});
</script>

<div class="page-container">
	<Menu
		onClearBoard={requestClearBoard}
		onStart={requestPathFinding}
		onGenerateMaze={requestGenerateMaze}
		onAlgorithmChange={requestChangeAlgorithm}
		onClearPath={requestClearPath}
		onAnimationSpeedChange={requestAnimationSpeedChange}
	/>
	<div class="grid-container" bind:this={gridContainer}>
		{#if isReadyToRender}
			<Grid
				{grid}
				{row_length}
				{col_length}
				{cellSize}
				{startNode}
				{endNode}
				on:down={handleDown}
				on:up={handleUp}
				on:move={handleMove}
			/>
		{:else}
			<div class="loader" />
		{/if}
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		min-height: 97svh; /* Ensures the container takes at least the full viewport height */
	}

	.grid-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
	}

	.loader {
		border: 4px solid #f3f3f3; /* Light grey */
		border-top: 4px solid rgb(15 23 42); /* Blue */
		border-radius: 50%;
		width: 80px; /* Bigger width */
		height: 80px; /* Bigger height */
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
