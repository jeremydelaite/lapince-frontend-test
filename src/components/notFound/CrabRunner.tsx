import { useEffect, useRef } from "react";

// Easter egg: Chrome T-Rex style runner game, La Pince edition.
// A pixel-art crab jumps over boiling pots. Space / ArrowUp / tap to jump.

const WIDTH = 600;
const HEIGHT = 200;
const GROUND_Y = 180;
const PIXEL = 3;
// Render upscale factor: keeps the simulation logic at 600px wide
// while producing a sharp canvas at larger display sizes
const SCALE = 1.5;

const GRAVITY = 0.55;
const JUMP_VELOCITY = -10.5;
const START_SPEED = 5;
const MAX_SPEED = 11;
const ACCELERATION = 0.0012;

const HI_SCORE_KEY = "lapince-crab-hi";

// "1" = body pixel, "2" = bubble pixel (accent color), "." = empty
const CRAB_FRAME_A = [
	".11................11.",
	"111.1............1.111",
	"1.111............111.1",
	"1111....1....1....1111",
	".111....1....1....111.",
	"..1....11....11....1..",
	"..1...11111111111..1..",
	"..11.1111111111111.11.",
	"..11111..111111..11111",
	"...111111111111111111.",
	"....11111111111111....",
	".....111111111111.....",
	"....11..11..11..11....",
	"...11...11...11...11..",
	"..11....1.....1....11.",
];

const CRAB_FRAME_B = [
	".11................11.",
	"111.1............1.111",
	"1.111............111.1",
	"1111....1....1....1111",
	".111....1....1....111.",
	"..1....11....11....1..",
	"..1...11111111111..1..",
	"..11.1111111111111.11.",
	"..11111..111111..11111",
	"...111111111111111111.",
	"....11111111111111....",
	".....111111111111.....",
	".....1..11..11..1.....",
	"....11...11...11.1....",
	"....1....1.....1..1...",
];

const POT_FRAME_A = [
	".....2.....2......",
	"...2....2.....2...",
	".....2.....2......",
	"..2.....2....2....",
	"...11111111111....",
	"..1111111111111...",
	"11.111111111111.11",
	"1..111111111111..1",
	"11.111111111111.11",
	"...111111111111...",
	"...111111111111...",
	"....1111111111....",
	".....11111111.....",
	"....11......11....",
];

const POT_FRAME_B = [
	"...2.....2....2...",
	".....2......2.....",
	"..2....2.....2....",
	"....2.....2.......",
	"...11111111111....",
	"..1111111111111...",
	"11.111111111111.11",
	"1..111111111111..1",
	"11.111111111111.11",
	"...111111111111...",
	"...111111111111...",
	"....1111111111....",
	".....11111111.....",
	"....11......11....",
];

// Bubble rows are decorative only: the hitbox starts below them
const POT_BUBBLE_ROWS = 4;

type GameState = "idle" | "running" | "over";

type Obstacle = {
	x: number;
	scale: number;
};

type Cloud = {
	x: number;
	y: number;
};

function drawSprite(
	ctx: CanvasRenderingContext2D,
	grid: string[],
	x: number,
	y: number,
	pixelSize: number,
	bodyColor: string,
	bubbleColor: string,
) {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			const cell = grid[row][col];
			if (cell === ".") {
				continue;
			}
			ctx.fillStyle = cell === "2" ? bubbleColor : bodyColor;
			ctx.fillRect(
				Math.round(x + col * pixelSize),
				Math.round(y + row * pixelSize),
				pixelSize,
				pixelSize,
			);
		}
	}
}

function readThemeColors(isDark: boolean) {
	const styles = getComputedStyle(document.documentElement);
	return {
		foreground:
			styles.getPropertyValue("--foreground").trim() ||
			(isDark ? "#fafafa" : "#09090b"),
		muted:
			styles.getPropertyValue("--muted-foreground").trim() ||
			(isDark ? "#a1a1aa" : "#71717a"),
		bubble: styles.getPropertyValue("--primary").trim() || "#facc15",
	};
}

function loadHiScore(): number {
	try {
		return Number(localStorage.getItem(HI_SCORE_KEY)) || 0;
	} catch {
		return 0;
	}
}

function saveHiScore(score: number) {
	try {
		localStorage.setItem(HI_SCORE_KEY, String(score));
	} catch {
		// localStorage unavailable: hi-score just won't persist
	}
}

export function CrabRunner({ isDark }: { isDark: boolean }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const colorsRef = useRef(readThemeColors(isDark));

	useEffect(() => {
		// Re-read CSS variables after the theme class has been applied to <html>
		const id = requestAnimationFrame(() => {
			colorsRef.current = readThemeColors(isDark);
		});
		return () => cancelAnimationFrame(id);
	}, [isDark]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		const dpr = (window.devicePixelRatio || 1) * SCALE;
		canvas.width = WIDTH * dpr;
		canvas.height = HEIGHT * dpr;
		ctx.scale(dpr, dpr);

		const crabWidth = CRAB_FRAME_A[0].length * PIXEL;
		const crabHeight = CRAB_FRAME_A.length * PIXEL;
		const crabX = 28;

		let state: GameState = "idle";
		let crabY = GROUND_Y - crabHeight;
		let velocityY = 0;
		let speed = START_SPEED;
		let distance = 0;
		let frameCount = 0;
		let obstacles: Obstacle[] = [];
		let clouds: Cloud[] = [
			{ x: 180, y: 30 },
			{ x: 460, y: 55 },
		];
		let nextSpawnX = WIDTH + 100;
		let hiScore = loadHiScore();
		let animationId = 0;
		let lastTime = performance.now();

		const reset = () => {
			crabY = GROUND_Y - crabHeight;
			velocityY = 0;
			speed = START_SPEED;
			distance = 0;
			frameCount = 0;
			obstacles = [];
			nextSpawnX = WIDTH + 100;
		};

		const jump = () => {
			if (crabY >= GROUND_Y - crabHeight) {
				velocityY = JUMP_VELOCITY;
			}
		};

		const handleAction = () => {
			if (state === "running") {
				jump();
				return;
			}
			if (state === "over") {
				reset();
			}
			state = "running";
			jump();
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.code === "Space" || event.code === "ArrowUp") {
				event.preventDefault();
				handleAction();
			}
		};

		const onPointerDown = (event: PointerEvent) => {
			event.preventDefault();
			handleAction();
		};

		const spawnObstacle = () => {
			const scale = Math.random() < 0.3 ? 4 : 3;
			obstacles.push({ x: WIDTH + 20, scale });
			const minGap = 240 + speed * 20;
			nextSpawnX = minGap + Math.random() * 260;
		};

		const collides = (obstacle: Obstacle) => {
			const potWidth = POT_FRAME_A[0].length * obstacle.scale;
			const potHeight = (POT_FRAME_A.length - POT_BUBBLE_ROWS) * obstacle.scale;
			const potX = obstacle.x + 4;
			const potY = GROUND_Y - potHeight;
			const cx = crabX + 12;
			const cy = crabY + 8;
			const cw = crabWidth - 24;
			const ch = crabHeight - 10;
			return (
				cx < potX + potWidth - 8 &&
				cx + cw > potX &&
				cy < potY + potHeight &&
				cy + ch > potY
			);
		};

		const drawGround = () => {
			const { foreground, muted } = colorsRef.current;
			ctx.fillStyle = foreground;
			ctx.fillRect(0, GROUND_Y, WIDTH, 2);
			ctx.fillStyle = muted;
			for (let i = 0; i < 12; i++) {
				const tickX = (i * 53 + 27 - Math.floor(distance * 0.7)) % (WIDTH + 40);
				const wrappedX = tickX < -20 ? tickX + WIDTH + 40 : tickX;
				ctx.fillRect(wrappedX, GROUND_Y + 6, 6, 2);
			}
		};

		const drawClouds = () => {
			ctx.fillStyle = colorsRef.current.muted;
			for (const cloud of clouds) {
				ctx.fillRect(cloud.x, cloud.y, 28, 3);
				ctx.fillRect(cloud.x + 6, cloud.y - 4, 16, 3);
			}
		};

		const drawScore = () => {
			const score = Math.floor(distance / 8);
			ctx.fillStyle = colorsRef.current.muted;
			ctx.font = "bold 12px 'Courier New', monospace";
			ctx.textAlign = "right";
			const hi = Math.max(hiScore, score);
			const label =
				hi > 0
					? `HI ${String(hi).padStart(5, "0")}  ${String(score).padStart(5, "0")}`
					: String(score).padStart(5, "0");
			ctx.fillText(label, WIDTH - 10, 18);
		};

		const drawCenteredText = (title: string, subtitle: string) => {
			const { foreground, muted } = colorsRef.current;
			ctx.textAlign = "center";
			ctx.fillStyle = foreground;
			ctx.font = "bold 16px 'Courier New', monospace";
			ctx.fillText(title, WIDTH / 2, 80);
			ctx.fillStyle = muted;
			ctx.font = "12px 'Courier New', monospace";
			ctx.fillText(subtitle, WIDTH / 2, 100);
		};

		const update = (dt: number) => {
			distance += speed * dt;
			speed = Math.min(MAX_SPEED, speed + ACCELERATION * dt * 16.67);
			frameCount += dt;

			velocityY += GRAVITY * dt;
			crabY = Math.min(crabY + velocityY * dt, GROUND_Y - crabHeight);

			for (const obstacle of obstacles) {
				obstacle.x -= speed * dt;
			}
			obstacles = obstacles.filter((o) => o.x > -100);

			nextSpawnX -= speed * dt;
			if (nextSpawnX <= 0) {
				spawnObstacle();
			}

			for (const cloud of clouds) {
				cloud.x -= speed * 0.2 * dt;
			}
			clouds = clouds.map((cloud) =>
				cloud.x < -40 ? { x: WIDTH + 20, y: 20 + Math.random() * 50 } : cloud,
			);

			if (obstacles.some(collides)) {
				state = "over";
				const score = Math.floor(distance / 8);
				if (score > hiScore) {
					hiScore = score;
					saveHiScore(hiScore);
				}
			}
		};

		const draw = () => {
			const { foreground, bubble } = colorsRef.current;
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			drawClouds();
			drawGround();
			drawScore();

			const onGround = crabY >= GROUND_Y - crabHeight;
			const legFrame =
				state === "running" && onGround && Math.floor(frameCount / 6) % 2 === 1
					? CRAB_FRAME_B
					: CRAB_FRAME_A;
			drawSprite(ctx, legFrame, crabX, crabY, PIXEL, foreground, bubble);

			const potFrame =
				Math.floor(frameCount / 12) % 2 === 0 ? POT_FRAME_A : POT_FRAME_B;
			for (const obstacle of obstacles) {
				const potHeight = POT_FRAME_A.length * obstacle.scale;
				drawSprite(
					ctx,
					potFrame,
					obstacle.x,
					GROUND_Y - potHeight + POT_BUBBLE_ROWS * obstacle.scale,
					obstacle.scale,
					foreground,
					bubble,
				);
			}

			if (state === "idle") {
				drawCenteredText("LA PINCE RUNNER", "Espace ou clic pour jouer");
			} else if (state === "over") {
				drawCenteredText("GAME OVER", "Espace ou clic pour rejouer");
			}
		};

		const loop = (time: number) => {
			const dt = Math.min((time - lastTime) / 16.67, 3);
			lastTime = time;
			if (state === "running") {
				update(dt);
			}
			draw();
			animationId = requestAnimationFrame(loop);
		};

		window.addEventListener("keydown", onKeyDown);
		canvas.addEventListener("pointerdown", onPointerDown);
		animationId = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("keydown", onKeyDown);
			canvas.removeEventListener("pointerdown", onPointerDown);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			role="img"
			aria-label="Mini-jeu : La Pince saute par-dessus des marmites bouillonnantes"
			className="mx-auto mt-16 mb-44 w-full max-w-[900px] cursor-pointer touch-none select-none"
			style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
		/>
	);
}
