import React from "react";
import { render, waitFor, screen } from "@testing-library/react";

import App from "./App";

test("Map renders", async () => {
  render(<App />);

  await waitFor(() => {
    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
  });
});
// this test is not working beacuse of the !mapbox-gl import in App.js suspected webpack syntax issue
