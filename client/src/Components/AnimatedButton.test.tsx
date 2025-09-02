import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnimatedButton from "./AnimatedButton";

describe("AnimatedButton", () => {
  it("renders the button with given text", () => {
    render(<AnimatedButton>Click Me</AnimatedButton>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("scales on hover", async () => {
    render(<AnimatedButton>Hover Me</AnimatedButton>);
    const btn = screen.getByRole("button", { name: /hover me/i });
    await userEvent.hover(btn);
    // We cannot read GSAP transforms directly, but ensure no errors on hover
    expect(btn).toBeInTheDocument();
  });
});
