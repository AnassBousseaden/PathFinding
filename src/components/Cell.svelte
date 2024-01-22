<script>
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let rowIndex;
	export let colIndex;
	export let type = 'empty';

	const handleMouseDown = function () {
		dispatch('down', { rowIndex: rowIndex, colIndex: colIndex });
	};
	const handleMouseUp = function () {
		dispatch('up', { rowIndex: rowIndex, colIndex: colIndex });
	};
	const handleMouseMove = function () {
		dispatch('move', { rowIndex: rowIndex, colIndex: colIndex });
	};
</script>

<div
	class="cell {type} "
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:mousemove={handleMouseMove}
/>

<!--  -->

<style>
	.cell {
		background-color: #ffffff;
		border: 1px solid #ddd;
		user-select: none;
		aspect-ratio: 1 / 1;
	}

	@keyframes placeWall {
		0% {
			transform: scale(0.5);
			opacity: 0;
			background-color: rgba(9, 4, 70, 0); /* Starting color with transparency */
		}
		100% {
			transform: scale(1);
			opacity: 1;
			background-color: rgba(9, 4, 70, 1); /* Final color without transparency */
		}
	}

	.cell.obstacle {
		background-color: rgb(9, 4, 70); /* Base color for the obstacle */
		animation: placeWall 0.1s ease-out forwards; /* Apply the animation */
	}

	.cell.start {
		background: linear-gradient(135deg, #32cd32 0%, #4caf50 100%);
		box-shadow: 0px 0px 10px #32cd32;
		border-radius: 50%; /* Circular shape */
		animation: pulseStart 1.5s infinite;
	}

	.cell.end {
		background: linear-gradient(135deg, #ff6347 0%, #f44336 100%);
		box-shadow: 0px 0px 10px #ff6347;
		border-radius: 50%; /* Circular shape */
		animation: pulseEnd 1.5s infinite;
	}

	@keyframes pulseStart {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes pulseEnd {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes placeWall {
		from {
			transform: scale(0.5);
		}

		to {
			transform: scale(1);
		}
	}

	.cell.path {
		background-color: rgb(255, 254, 106);
		animation: shortestPath 1.5s ease-out forwards;
	}
	@keyframes shortestPath {
		0% {
			transform: scale(1);
			background-color: rgb(255, 254, 106);
			box-shadow: 0 0 5px rgb(255, 254, 106);
		}
		50% {
			transform: scale(1.1);
			background-color: rgb(255, 223, 0);
			box-shadow: 0 0 10px rgb(255, 223, 0);
		}
		100% {
			transform: scale(1);
			background-color: rgb(255, 254, 106);
			box-shadow: 0 0 5px rgb(255, 254, 106);
		}
	}

	.cell.exploring {
		background-color: rgba(10, 131, 149, 0.75);
		animation-name: visitedAnimation;
		animation-duration: 0.5s;
		animation-timing-function: ease-out;
		animation-delay: 0;
		animation-direction: alternate;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		animation-play-state: running;
	}
	@keyframes visitedAnimation {
		0% {
			transform: scale(0.5);
			background-color: rgba(255, 99, 71, 0.8); /* Tomato color */
		}

		25% {
			transform: scale(0.8);
			background-color: rgba(255, 215, 0, 0.8); /* Gold color */
		}

		50% {
			transform: scale(1.1);
			background-color: rgba(60, 179, 113, 0.8); /* Medium sea green */
		}

		75% {
			transform: scale(1.2);
			background-color: rgba(100, 149, 237, 0.8); /* Cornflower blue */
		}

		100% {
			transform: scale(1);
			background-color: rgba(93, 139, 207, 0.8); /* Medium purple */
		}
	}
	.visited-node {
		animation: visitedAnimation 1s ease-out forwards;
	}
</style>
