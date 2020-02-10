import React from "react";
import {
  render,
  waitForElement,
  getByLabelText,
  fireEvent
} from "@testing-library/react";
import App from "../App";

it("Can perform a simple search in the UI", async () => {
  const { getByText } = render(<App />);

  await waitForElement(() => getByText("Go"));

  const l = getByLabelText(document.body, "Term");
  const f = getByLabelText(document.body, "From");
  const t = getByLabelText(document.body, "To");

  fireEvent.change(l, { target: { value: "asthma" } });
  fireEvent.change(f, { target: { value: "1900" } });
  fireEvent.change(t, { target: { value: "1901" } });
  fireEvent.click(getByText("Go"));

  await waitForElement(() => getByText("Search in progress"));

  expect(getByText("Search in progress")).toHaveClass("Search-running");
});
