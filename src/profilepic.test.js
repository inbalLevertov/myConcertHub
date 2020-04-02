import React from "react";
import { ProfilePic } from "./ProfilePic";
import { render, fireEvent } from "@testing-library/react";

test("renders default image when there is no url", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").src).toContain("/default.jpg");
});

test("renders image with specified url prop", () => {
    const { container } = render(<ProfilePic url="/some-url.gif" />);
    expect(container.querySelector("img").src).toContain("/some-url.gif");
});

test("renders image with first and last props in alt", () => {
    const { container } = render(<ProfilePic first="inbal" last="levertov" />);
    expect(container.querySelector("img").alt).toContain("inbal levertov");
});

test("onClick prop gets called when img is clicked", () => {
    const onClick = jest.fn();
    const { container } = render(<ProfilePic clickHandler={onClick} />);
    const img = container.querySelector("img");
    fireEvent.click(img);
    expect(onClick.mock.calls.length).toBe(1);
});
