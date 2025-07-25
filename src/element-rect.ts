import type {IElementRect} from './types';

export default class ElementRect implements IElementRect {
	public readonly x: number;
	public readonly y: number;
	public readonly width: number;
	public readonly height: number;
	public readonly top: number;
	public readonly bottom: number;
	public readonly right: number;
	public readonly left: number;
	public readonly center: DOMRectReadOnly;
	public readonly element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;

		const {x, y, width, height, top, bottom, left, right}: DOMRect = element.getBoundingClientRect();

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.top = top;
		this.bottom = bottom;
		this.left = left;
		this.right = right;
		this.center = this.getCenter(this);

		this.nearPlumbLineIsBetter = this.nearPlumbLineIsBetter.bind(this);
		this.nearHorizonIsBetter = this.nearHorizonIsBetter.bind(this);
		this.nearTargetLeftIsBetter = this.nearTargetLeftIsBetter.bind(this);
		this.nearTargetTopIsBetter = this.nearTargetTopIsBetter.bind(this);
		this.topIsBetter = this.topIsBetter.bind(this);
		this.bottomIsBetter = this.bottomIsBetter.bind(this);
		this.leftIsBetter = this.leftIsBetter.bind(this);
		this.rightIsBetter = this.rightIsBetter.bind(this);
	}

	private getCenter({width, height, left, top}: DOMRectReadOnly): DOMRectReadOnly {
		const x: number = left + Math.floor(width / 2);
		const y: number = top + Math.floor(height / 2);

		return { x, y, left: x, right: x, top: y, bottom: y, width: 0, height: 0, toJSON: () => ({ x, y })};
	}

	public toJSON(): Omit<DOMRect, 'toJSON'> & { center: Omit<DOMRect, 'toJSON'> } {
		const {x, y, width, height, top, bottom, left, right, center} = this;
		return {x, y, width, height, top, bottom, left, right, center};
	}

	public nearPlumbLineIsBetter({ left, center, right }: IElementRect): number {
		const d: number = center.x < this.center.x ? this.center.x - right : left - this.center.x;
		return d < 0 ? 0 : d;
	}

	public nearHorizonIsBetter({ center, bottom, top }: IElementRect): number {
		const d: number = center.y < this.center.y ? this.center.y - bottom : top - this.center.y;
		return d < 0 ? 0 : d;
	}

	public nearTargetLeftIsBetter({ center, right, left }: IElementRect): number {
		const d: number = center.x < this.center.x ? this.left - right : left - this.left;
		return d < 0 ? 0 : d;
	}

	public nearTargetTopIsBetter({ center, bottom, top }: IElementRect): number {
		const d: number = center.y < this.center.y ? this.top - bottom : top - this.top;
		return d < 0 ? 0 : d;
	}

	public topIsBetter({ top }: IElementRect): number {
		return top;
	}

	public bottomIsBetter({ bottom }: IElementRect): number {
		return -1 * bottom;
	}

	public leftIsBetter({ left }: IElementRect): number {
		return left;
	}

	public rightIsBetter({ right }: IElementRect): number {
		return -1 * right;
	}
}
