import { render } from "@testing-library/react";
import { highlightMatch } from "../highlightMatch";

describe("highlightMatch", () => {
  it("returns plain text when query is empty", () => {
    const { container } = render(<>{highlightMatch("hello world", "")}</>);
    expect(container.textContent).toBe("hello world");
    expect(container.querySelector("mark")).toBeNull();
  });

  it("returns plain text when query is whitespace", () => {
    const { container } = render(<>{highlightMatch("hello world", "   ")}</>);
    expect(container.textContent).toBe("hello world");
    expect(container.querySelector("mark")).toBeNull();
  });

  it("returns plain text when there is no match", () => {
    const { container } = render(<>{highlightMatch("hello world", "xyz")}</>);
    expect(container.textContent).toBe("hello world");
    expect(container.querySelector("mark")).toBeNull();
  });

  it("wraps matched substring in <mark>", () => {
    const { container } = render(<>{highlightMatch("hello world", "world")}</>);
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark!.textContent).toBe("world");
    expect(container.textContent).toBe("hello world");
  });

  it("matches case-insensitively", () => {
    const { container } = render(<>{highlightMatch("Hello World", "hello")}</>);
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark!.textContent).toBe("Hello");
  });

  it("highlights match at the start", () => {
    const { container } = render(<>{highlightMatch("hello world", "hello")}</>);
    const mark = container.querySelector("mark");
    expect(mark!.textContent).toBe("hello");
  });

  it("highlights match at the end", () => {
    const { container } = render(<>{highlightMatch("hello world", "world")}</>);
    const mark = container.querySelector("mark");
    expect(mark!.textContent).toBe("world");
  });
});
