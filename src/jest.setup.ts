import { TextDecoder, TextEncoder } from 'util';
import '@testing-library/jest-dom';

// Polyfill for TextEncoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof window.TextEncoder === 'undefined') {
  window.TextEncoder = global.TextEncoder;
}

// Polyfill for TextDecoder
if (typeof global.TextDecoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.TextDecoder = TextDecoder;
}
if (typeof window.TextDecoder === 'undefined') {
  window.TextDecoder = global.TextDecoder;
}

/**
 * Shadcn Select combobox is not supported by jest-dom yet. This is a workaround to make it work.
 */
// Mock PointerEvent and related methods for JSDOM
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}

// Apply the mocks globally
global.PointerEvent = MockPointerEvent as any;
global.HTMLElement.prototype.scrollIntoView = jest.fn();
global.HTMLElement.prototype.releasePointerCapture = jest.fn();
global.HTMLElement.prototype.hasPointerCapture = jest.fn(() => false); // Mock hasPointerCapture to return false
