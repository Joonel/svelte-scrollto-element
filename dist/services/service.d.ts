import { ScrollToElementOptions } from '../global.interface';
export declare const scrollto: (node: Node, options: ScrollToElementOptions) => {
    update(options: ScrollToElementOptions): void;
    destroy(): void;
};
export declare const scrolltotop: (node: Node, options: ScrollToElementOptions) => {
    update(options: ScrollToElementOptions): void;
    destroy(): void;
};
export declare const scrolltobottom: (node: Node, options: ScrollToElementOptions) => {
    update(options: ScrollToElementOptions): void;
    destroy(): void;
};
export declare const animateScroll: {
    scrollTo: (options: ScrollToElementOptions) => (() => void);
    scrollToTop: (options?: ScrollToElementOptions) => (() => void);
    scrollToBottom: (options?: ScrollToElementOptions) => (() => void);
    setGlobalOptions: (options: ScrollToElementOptions) => void;
};
