import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("Todo Calendar 제목이 렌더링된다", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Todo Calendar" })).toBeInTheDocument();
  });
});
