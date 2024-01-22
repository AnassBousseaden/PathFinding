

export const algorithms = { "bfs": bfs, "a_star": a_star }


// @ts-ignore
// Assuming startNode and endNode are objects like { rowIndex: 0, colIndex: 0 }
function bfs(startNode, endNode, graph) {
    const y_length = graph.length;
    const x_length = graph[0].length;
    const predecessors = new Map(); // to keep track of predecessors

    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    // start
    let current_queue = [[startNode.colIndex, startNode.rowIndex]];
    const cells = [];
    while (current_queue.length) {
        const next_queue = [];
        cells.push(...current_queue);
        for (const node of current_queue) {
            const [x, y] = node;
            if (graph[y][x] == 1) continue;
            graph[y][x] = 1;
            if (x === endNode.colIndex && y === endNode.rowIndex) {
                return [reconstruct_path([startNode.colIndex, startNode.rowIndex], [endNode.colIndex, endNode.rowIndex], predecessors), cells];
            }
            for (const [x_dir, y_dir] of dirs) {
                const new_x = x + x_dir;
                const new_y = y + y_dir;
                if (0 <= new_x && new_x < x_length && 0 <= new_y && new_y < y_length && (graph[new_y][new_x] == 0)) {
                    predecessors.set(`${new_x},${new_y}`, [x, y]);
                    next_queue.push([new_x, new_y]);
                }
            }
        }
        current_queue = next_queue;
    }
    return [[], cells];
}


// TODO
// @ts-ignore
function a_star(startNode, endNode, graph) {
    const y_length = graph.length;
    const x_length = graph[0].length;
    const predecessors = new Map();
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    // @ts-ignore
    const heuristic = (node) => {
        // Manhattan distance
        return Math.abs(node[0] - endNode.colIndex) + Math.abs(node[1] - endNode.rowIndex);
    };

    let openSet = [[startNode.colIndex, startNode.rowIndex]];
    const cells = [];
    const gScores = new Map();
    gScores.set(`${startNode.colIndex},${startNode.rowIndex}`, 0);

    while (openSet.length) {
        // Sort nodes in openSet by fScore
        openSet.sort((a, b) => (gScores.get(`${a[0]},${a[1]}`) + heuristic(a)) - (gScores.get(`${b[0]},${b[1]}`) + heuristic(b)));

        const current = openSet.shift();
        cells.push(current);

        // @ts-ignore
        if (current[0] === endNode.colIndex && current[1] === endNode.rowIndex) {
            return [reconstruct_path([startNode.colIndex, startNode.rowIndex], [endNode.colIndex, endNode.rowIndex], predecessors), cells];
        }

        for (const [x_dir, y_dir] of dirs) {
            // @ts-ignore
            const new_x = current[0] + x_dir;
            // @ts-ignore
            const new_y = current[1] + y_dir;
            if (0 <= new_x && new_x < x_length && 0 <= new_y && new_y < y_length && graph[new_y][new_x] == 0) {
                // @ts-ignore
                const tentative_gScore = gScores.get(`${current[0]},${current[1]}`) + 1;
                if (tentative_gScore < (gScores.get(`${new_x},${new_y}`) || Infinity)) {
                    predecessors.set(`${new_x},${new_y}`, current);
                    gScores.set(`${new_x},${new_y}`, tentative_gScore);
                    if (!openSet.some(node => node[0] === new_x && node[1] === new_y)) {
                        openSet.push([new_x, new_y]);
                    }
                }
            }
        }
    }
    return [[], cells];
}


// @ts-ignore
function reconstruct_path(start, end, predecessors) {
    let current = end;
    const path = [end];
    while (current[0] !== start[0] || current[1] !== start[1]) {
        current = predecessors.get(`${current[0]},${current[1]}`);
        path.unshift(current); // Add to the beginning of the path
    }
    return path;
}


// @ts-ignore
// @ts-ignore
export function generateObstacles(row_length, col_length, startNode, endNode) {
    // Initialize all cells as walls
    let maze = new Array(row_length).fill(null).map(() => new Array(col_length).fill(true));

    // Function to carve paths in the maze
    // @ts-ignore
    function carvePath(x, y) {
        const dirs = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        maze[y][x] = false;

        // Shuffle directions to ensure randomness
        for (let i = dirs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }

        // Explore each direction
        for (let [dx, dy] of dirs) {
            const nx = x + dx * 2,
                ny = y + dy * 2;
            if (nx >= 0 && nx < col_length && ny >= 0 && ny < row_length && maze[ny][nx]) {
                maze[ny - dy][nx - dx] = false;
                carvePath(nx, ny);
            }
        }
    }

    // Start carving from a random cell, ensuring it's an odd cell
    let startX = Math.floor(Math.random() * Math.floor((col_length - 1) / 2)) * 2 + 1;
    let startY = Math.floor(Math.random() * Math.floor((row_length - 1) / 2)) * 2 + 1;
    carvePath(startX, startY);

    // Convert maze array to list of walls
    let walls = [];
    for (let y = 0; y < row_length; y++) {
        for (let x = 0; x < col_length; x++) {
            if (maze[y][x]) walls.push([y, x]);
        }
    }

    // Ensure start and end nodes are not walls
    walls = walls.filter(
        ([y, x]) =>
            !(y === startNode.rowIndex && x === startNode.colIndex) &&
            !(y === endNode.rowIndex && x === endNode.colIndex)
    );

    return walls;
}

