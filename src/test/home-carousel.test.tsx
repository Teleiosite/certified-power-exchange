import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "@/components/site/public-pages";

const { carouselApi } = vi.hoisted(() => ({
  carouselApi: {
    selectedScrollSnap: vi.fn(() => 0),
    on: vi.fn(),
    off: vi.fn(),
    scrollNext: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", async () => {
  const React = await import("react");
  return {
    Link: ({ to, children, ...props }: React.ComponentProps<"a"> & { to: string }) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

vi.mock("@/components/ui/carousel", async () => {
  const React = await import("react");
  const Carousel = ({
    setApi,
    opts: _opts,
    children,
    ...props
  }: React.ComponentProps<"div"> & {
    opts?: unknown;
    setApi?: (api: typeof carouselApi) => void;
  }) => {
    React.useEffect(() => setApi?.(carouselApi), [setApi]);
    return React.createElement(
      "div",
      { role: "region", "aria-roledescription": "carousel", ...props },
      children,
    );
  };
  return {
    Carousel,
    CarouselContent: ({ children, ...props }: React.ComponentProps<"div">) =>
      React.createElement("div", props, children),
    CarouselItem: ({ children, ...props }: React.ComponentProps<"div">) =>
      React.createElement("div", props, children),
    CarouselPrevious: (props: React.ComponentProps<"button">) =>
      React.createElement("button", { ...props, type: "button" }),
    CarouselNext: (props: React.ComponentProps<"button">) =>
      React.createElement("button", { ...props, type: "button" }),
  };
});

function advanceCarousel() {
  act(() => {
    vi.advanceTimersByTime(4000);
  });
}

describe("HomePage carousel autoplay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("keeps manual pause persistent and resumes with the accessible Play control", () => {
    render(<HomePage />);
    const carousel = screen.getByRole("region", { name: "Featured energy solutions" });
    const toggle = screen.getByRole("button", { name: "Pause slideshow" });

    advanceCarousel();
    expect(carouselApi.scrollNext).toHaveBeenCalledTimes(1);

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Play slideshow" })).toBeInTheDocument();
    fireEvent.mouseEnter(carousel);
    fireEvent.mouseLeave(carousel);
    advanceCarousel();
    expect(carouselApi.scrollNext).toHaveBeenCalledTimes(1);

    const playButton = screen.getByRole("button", { name: "Play slideshow" });
    const previous = screen.getByRole("button", { name: "Previous featured slide" });
    fireEvent.focus(previous);
    fireEvent.blur(previous, { relatedTarget: playButton });
    fireEvent.focus(playButton);
    fireEvent.click(playButton);
    advanceCarousel();
    expect(carouselApi.scrollNext).toHaveBeenCalledTimes(2);
  });

  it("stays paused while either hovered or focused, ignoring focus changes within the carousel", () => {
    render(<HomePage />);
    const carousel = screen.getByRole("region", { name: "Featured energy solutions" });
    const previous = screen.getByRole("button", { name: "Previous featured slide" });
    const next = screen.getByRole("button", { name: "Next featured slide" });

    fireEvent.mouseEnter(carousel);
    fireEvent.focus(previous);
    fireEvent.mouseLeave(carousel);
    advanceCarousel();
    expect(carouselApi.scrollNext).not.toHaveBeenCalled();

    fireEvent.blur(previous, { relatedTarget: next });
    fireEvent.focus(next);
    advanceCarousel();
    expect(carouselApi.scrollNext).not.toHaveBeenCalled();

    fireEvent.blur(next, { relatedTarget: document.body });
    advanceCarousel();
    expect(carouselApi.scrollNext).toHaveBeenCalledTimes(1);
  });
});
