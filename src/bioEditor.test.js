import React from "react";
import { BioEditor } from "./BioEditor";
import axios from "./axioscopy";
import { render, waitForElement, fireEvent } from "@testing-library/react";

jest.mock("./axioscopy");

test("when theres no bio, add button renders", () => {
    const { container } = render(<BioEditor bio={null} />);
    expect(container.querySelector("button").id).toContain("addBio");
});

test("when theres is a bio, edit button renders", () => {
    // {this.props.bio} = null;
    const { container } = render(<BioEditor bio="myBio" />);
    expect(container.querySelector("button").id).toContain("editBio");
});

test("Clicking Add || Edit button renders a textarea and a Save button", () => {
    const onClick = jest.fn();
    const { container } = render(<BioEditor onClick={onClick} />);
    const btn = container.querySelector("button");
    fireEvent.click(btn);
    expect(container.innerHTML).toContain("textarea");
});
