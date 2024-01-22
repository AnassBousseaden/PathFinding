<script>
	// @ts-nocheck
	import Cell from './Cell.svelte';
	export let row_length;
	export let col_length;
	export let cellSize;
	export let grid;
	export let startNode;
	export let endNode;
	let gridTemplateColumns = `repeat(${col_length}, ${cellSize}px)`;
	let gridTemplateRows = `repeat(${row_length}, ${cellSize}px)`;
	$: getCellType = function (rowIndex, colIndex) {
		if (rowIndex == startNode.rowIndex && colIndex == startNode.colIndex) return 'start';
		if (rowIndex == endNode.rowIndex && colIndex == endNode.colIndex) return 'end';
		switch (grid[rowIndex][colIndex]) {
			case 1:
				return 'obstacle'; // Obstacle
			case 2:
				return 'exploring'; // Exploring (part of the animation)
			case 3:
				return 'path'; // Final path
			default:
				return 'empty'; // Empty cell
		}
	};
</script>

<div
	class="board"
	style="grid-template-columns: {gridTemplateColumns}; grid-template-rows: {gridTemplateRows};"
>
	{#each grid as row, rowIndex}
		{#each row as type, colIndex}
			<Cell {rowIndex} {colIndex} type={getCellType(rowIndex, colIndex)} on:down on:up on:move />
		{/each}
	{/each}
</div>

<style>
	.board {
		width: 100%;
		height: 100%;
		display: grid;
		/* aspect-ratio: 1 / 1; */
		margin-left: auto;
		margin-right: auto;
		justify-content: center;
	}
</style>
