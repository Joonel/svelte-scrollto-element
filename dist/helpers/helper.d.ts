import { ScrollToElementOptions, ScrollToElementPosition } from '../global.interface';
export declare const $: (selector: HTMLElement) => HTMLElement;
export declare const extend: (...args: ScrollToElementOptions[]) => ScrollToElementOptions;
export declare const cumulativeOffset: (element: HTMLElement | any) => ScrollToElementPosition;
export declare const directScroll: (element: HTMLElement | any) => boolean;
export declare const scrollTop: (element: HTMLElement | any, value?: number) => number;
export declare const scrollLeft: (element: HTMLElement, value?: number) => number;
