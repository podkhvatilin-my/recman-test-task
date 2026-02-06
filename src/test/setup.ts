import "@testing-library/jest-dom/vitest";

// Mock HTMLDialogElement.prototype.showModal
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};

// Mock HTMLDialogElement.prototype.close
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
  this.dispatchEvent(new Event("close"));
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
