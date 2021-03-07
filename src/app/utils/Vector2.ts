export function V(x: number, y: number): Vector2 {
	return new Vector2(x, y);
}

export class Vector2 {
	readonly x: number;
	readonly y: number;

	constructor();
	constructor(x: number, y: number);
	constructor(x?: number, y?: number) {
		this.x = x || 0;
		this.y = y || 0;
	}


	floor(): Vector2 {
		return V(Math.floor(this.x), Math.floor(this.y));
	}

	round(): Vector2 {
		return V(Math.floor(this.x), Math.floor(this.y));
	}

	add(other: Vector2): Vector2 {
		return V(this.x + other.x, this.y + other.y);
	}

	subtract(other: Vector2): Vector2 {
		return V(this.x - other.x, this.y - other.y);
	}

	multiply(scalar: number): Vector2 {
		return V(this.x * scalar, this.y * scalar);
	}

	divide(scalar: number): Vector2 {
		return V(this.x / scalar, this.y / scalar);
	}

	normalise(): Vector2 {
		return this.divide(this.length());
	}

	min(other: Vector2): Vector2 {
		return V(Math.min(this.x, other.x), Math.min(this.y, other.y));
	}

	max(other: Vector2): Vector2 {
		return V(Math.max(this.x, other.x), Math.max(this.y, other.y));
	}

	apply(func: (x: number) => number) {
		return V(func(this.x), func(this.y));
	}

	sqdist(pos: Vector2): number {
		const delta = this.subtract(pos);
		return delta.x * delta.x + delta.y * delta.y;
	}

	sqlength(): number {
		return this.x * this.x + this.y * this.y;
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	angleDeg(): number {
		return Math.atan2(this.y, this.x) * 180 / 3.1415;
	}

	hash(): number {
		return this.x + this.y * 10000;
	}

	equals(other: Vector2) {
		return this.x == other.x && this.y == other.y;
	}

	toString(): string {
		return `${this.x}, ${this.y}`;
	}
}
