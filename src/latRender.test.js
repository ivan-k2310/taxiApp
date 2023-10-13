import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("mapbox-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    addLayer: jest.fn(),
    getSource: jest.fn(),
  })),
}));

describe("App", () => {
  it("renders the component", () => {
    render(<App />);
    expect(screen.getByText("Longitude:")).toBeInTheDocument();
  });
});

// this test is not working beacuse of the mapbox-gl dependency suspecion is that the mapbox-gl is not mocked properly
