import React from "react";
import { App } from "./App";
import axios from "./axioscopy";
import { render, waitForElement } from "@testing-library/react";

//automatic mock
jest.mock("./axioscopy");

test("app renders correctly", async () => {
    axios.get.mockResolvedValue({
        data: {
            details: {
                id: 1,
                first: "inbal",
                last: "levertov",
                url: "/inballevertov.jpg"
            }
        }
    });

    const { container } = render(<App />);
    await waitForElement(() => container.querySelector("div"));
    expect(container.innerHTML).toContain("<div>");
});
