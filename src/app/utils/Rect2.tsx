import { Vector2 } from "./Vector2";

export class Rect2 {
	minPos: Vector2;
	size: Vector2;

	get maxPos(): Vector2 {
		return this.minPos.add(this.size);
	}

	get center(): Vector2 {
		return this.size.divide(2).add(this.minPos);
	}

	set center(v: Vector2) {
		this.minPos = v.subtract(this.size.divide(2)).round();
	}

	get top(): number {
		return this.minPos.y;
	}

	get right(): number {
		return this.maxPos.x;
	}

	get bottom(): number {
		return this.maxPos.y;
	}

	get left(): number {
		return this.minPos.x;
	}

	constructor(minPos?: Vector2, size?: Vector2) {
		this.minPos = minPos || new Vector2();
		this.size = size || new Vector2();
	}

	clone(): Rect2 {
		return new Rect2(this.minPos, this.size);
	}

	floor(): Rect2 {
		return new Rect2(this.minPos.floor(), this.size.floor());
	}

	round(): Rect2 {
		return new Rect2(this.minPos.round(), this.size.round());
	}

	grow(v: number): Rect2 {
		return new Rect2(
			this.minPos.subtract(new Vector2(v, v)),
			this.size.add(new Vector2(v*2, v*2)))
	}

	extend(other: Rect2): Rect2 {
		const maxPos = new Vector2(
			Math.max(this.maxPos.x, other.maxPos.x),
			Math.max(this.maxPos.y, other.maxPos.y));

		this.minPos =
			new Vector2(Math.min(this.minPos.x, other.minPos.x),
				Math.min(this.minPos.y, other.minPos.y));
		this.size = maxPos.subtract(this.minPos);

		return this;
	}

	contains(p: Vector2): boolean {
		const minPos = this.minPos;
		const maxPos = this.maxPos;
		return p.x >= minPos.x && p.x < maxPos.x &&
				p.y >= minPos.y && p.y < maxPos.y;
	}

	intersects(b: Rect2): boolean {
		const a = this; // eslint-disable-line
		return a.left < b.right &&
			b.left < a.right &&
			a.top < b.bottom &&
			b.top < a.bottom;
	}

	toString(): string {
		return `${this.minPos.toString()} to ${this.maxPos.toString()}`;
	}
}
