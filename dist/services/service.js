import { cubicInOut } from 'svelte/easing';
import { loop, noop, now } from 'svelte/internal';
import { $, cumulativeOffset, extend, scrollLeft, scrollTop } from '../helpers/helper.js';
const defaultOptions = {
    container: 'body',
    duration: 500,
    delay: 0,
    offset: 0,
    easing: cubicInOut,
    onStart: noop,
    onDone: noop,
    onAborting: noop,
    scrollX: false,
    scrollY: true
};
const scrollToInternal = (options) => {
    const { duration, delay, easing, x = 0, y = 0, scrollX, scrollY, onStart, onDone, container, onAborting, element } = options;
    let { offset } = options;
    if (typeof offset === 'function') {
        offset = offset();
    }
    const cumulativeOffsetContainer = cumulativeOffset(container);
    const cumulativeOffsetTarget = element ? cumulativeOffset(element) : { top: y, left: x };
    const initialX = scrollLeft(container);
    const initialY = scrollTop(container);
    const targetX = cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
    const targetY = cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;
    const diffX = targetX - initialX;
    const diffY = targetY - initialY;
    let scrolling = true;
    let started = false;
    const startTime = now() + delay;
    const endTime = startTime + duration;
    function scrollToTopLeft(element, top, left) {
        if (scrollX)
            scrollLeft(element, left);
        if (scrollY)
            scrollTop(element, top);
    }
    function start(delayStart) {
        if (!delayStart) {
            started = true;
            onStart(element, { x, y });
        }
    }
    function tick(progress) {
        scrollToTopLeft(container, initialY + diffY * progress, initialX + diffX * progress);
    }
    function stop() {
        scrolling = false;
    }
    loop((now) => {
        if (!started && now >= startTime) {
            start(false);
        }
        if (started && now >= endTime) {
            tick(1);
            stop();
            onDone(element, { x, y });
        }
        if (!scrolling) {
            onAborting(element, { x, y });
            return false;
        }
        if (started) {
            const p = now - startTime;
            const t = 0 + 1 * easing(p / duration);
            tick(t);
        }
        return true;
    });
    start(delay);
    tick(0);
    return stop;
};
const proceedOptions = (options) => {
    const opts = extend({}, defaultOptions, options);
    opts.container = $(opts.container);
    opts.element = $(opts.element);
    return opts;
};
const scrollContainerHeight = (containerElement) => {
    if (containerElement && containerElement !== document && containerElement !== document.body) {
        return (containerElement.scrollHeight -
            containerElement.offsetHeight);
    }
    const { body } = document;
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};
const setGlobalOptions = (options) => {
    extend(defaultOptions, options || {});
};
const scrollTo = (options) => scrollToInternal(proceedOptions(options));
const scrollToBottom = (options) => {
    options = proceedOptions(options);
    return scrollToInternal(extend(options, {
        element: null,
        y: scrollContainerHeight(options.container)
    }));
};
const scrollToTop = (options) => {
    options = proceedOptions(options);
    return scrollToInternal(extend(options, {
        element: null,
        y: 0
    }));
};
const makeScrollToAction = (scrollToFunc) => (node, options) => {
    let current = options;
    const handle = (e) => {
        e.preventDefault();
        scrollToFunc(typeof current === 'string' ? { element: current } : current);
    };
    node.addEventListener('click', handle);
    node.addEventListener('touchstart', handle);
    return {
        update(options) {
            current = options;
        },
        destroy() {
            node.removeEventListener('click', handle);
            node.removeEventListener('touchstart', handle);
        }
    };
};
// Actions
export const scrollto = makeScrollToAction(scrollTo);
export const scrolltotop = makeScrollToAction(scrollToTop);
export const scrolltobottom = makeScrollToAction(scrollToBottom);
// Methods
export const animateScroll = { scrollTo, scrollToTop, scrollToBottom, setGlobalOptions };
