import React from "react";
import { render, waitForElement } from "@testing-library/react";
import App from "./App";

it("Renders the app", async () => {
  const { getByRole } = render(<App />);

  await waitForElement(() => getByRole("heading"));

  expect(getByRole("heading")).toHaveTextContent(
    "Trends in Scientific Publications"
  );
});
