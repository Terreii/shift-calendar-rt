import { render, fireEvent, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import ShareMenu from "./share-menu";

describe("components/ShareMenu", () => {
  it("should render", () => {
    render(
      <ShareMenu group={0} search={null} shiftModel="6-6" hide={() => {}} />,
    );

    const address = screen.queryByLabelText("Adresse zum teilen:");
    expect(address).toBeTruthy();
    expect(address.nodeName).toBe("INPUT");
    expect(address).toHaveAttribute("type", "url");
    expect(address).toHaveValue("http://localhost/");

    const shiftModel = screen.queryByLabelText("Schichtmodell");
    expect(shiftModel).toBeTruthy();
    expect(shiftModel.nodeName).toBe("INPUT");
    expect(shiftModel).toHaveAttribute("type", "checkbox");

    expect(screen.queryByLabelText("Gruppe")).toBeNull();
    const group = screen.queryByText("Momentan sind alle Gruppen ausgewählt.");
    expect(group).toBeTruthy();
    expect(group.nodeName).toBe("SMALL");

    expect(screen.queryByLabelText("Der gesuchte Tag")).toBeNull();
    const search = screen.queryByText("Momentan gibt es kein Suchergebnis.");
    expect(search).toBeTruthy();
    expect(search.nodeName).toBe("SMALL");
  });

  it("should allow to share the group if a group is selected", () => {
    render(
      <ShareMenu group={5} search={null} shiftModel="6-6" hide={() => {}} />,
    );

    const group = screen.queryByLabelText("Gruppe");
    expect(group).toBeTruthy();
    expect(group.nodeName).toBe("INPUT");
    expect(group).toHaveAttribute("type", "checkbox");
    expect(group).toBeEnabled();

    expect(
      screen.queryByText("Momentan sind alle Gruppen ausgewählt."),
    ).toBeNull();
  });

  it("should allow to share the search result if a there is one", () => {
    render(
      <ShareMenu
        group={0}
        search={[2020, 4, 5]}
        shiftModel="6-6"
        hide={() => {}}
      />,
    );

    const search = screen.queryByLabelText("Der gesuchte Tag");
    expect(search).toBeTruthy();
    expect(search.nodeName).toBe("INPUT");
    expect(search).toHaveAttribute("type", "checkbox");
    expect(search).toBeEnabled();

    expect(
      screen.queryByText("Momentan gibt es kein Suchergebnis."),
    ).toBeNull();
  });

  it("should update the url", async () => {
    render(
      <ShareMenu
        group={5}
        search={[2020, 4, 5]}
        shiftModel="6-6"
        hide={() => {}}
      />,
    );

    const address = screen.queryByLabelText("Adresse zum teilen:");
    expect(address).toHaveValue("http://localhost/");

    const shareButton = screen.queryByText("Teilen");
    expect(shareButton).toBeInTheDocument();
    expect(shareButton.nodeName).toBe("A");
    expect(shareButton).toBeEnabled();
    expect(shareButton.href).toBe(
      "mailto:?subject=Schichtkalender&" +
        "body=Meine%20Schichten%20beim%20Bosch%20Reutlingen:%20http://localhost/",
    );

    fireEvent.click(screen.queryByLabelText("Schichtmodell"));
    expect(await screen.findByLabelText("Schichtmodell")).toBeChecked();
    expect(address).toHaveValue("http://localhost/cal/6-6");
    expect(shareButton.href).toMatch(/mailto.*http:\/\/localhost\/cal\/6-6/);

    fireEvent.click(screen.queryByLabelText("Gruppe"));
    expect(await screen.findByLabelText("Gruppe")).toBeChecked();
    expect(address).toHaveValue("http://localhost/cal/6-6?group=5");
    expect(shareButton.href).toMatch(
      /mailto.*http:\/\/localhost\/cal\/6-6\?group=5/,
    );

    fireEvent.click(screen.queryByLabelText("Der gesuchte Tag"));
    expect(await screen.findByLabelText("Der gesuchte Tag")).toBeChecked();
    expect(address).toHaveValue(
      "http://localhost/cal/6-6?search=2020%2C4%2C5&group=5",
    );
    expect(shareButton.href).toMatch(
      /mailto.*http:\/\/localhost\/cal\/6-6\?search=2020%2C4%2C5%26group=5/,
    );
  });

  it("should update the shift model and group together", async () => {
    render(
      <ShareMenu
        group={2}
        search={[2020, 4, 5]}
        shiftModel="6-6"
        hide={() => {}}
      />,
    );

    expect(screen.queryByLabelText("Schichtmodell")).not.toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Gruppe"));
    expect(await screen.findByLabelText("Gruppe")).toBeChecked();
    expect(screen.queryByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Schichtmodell"));
    expect(await screen.findByLabelText("Schichtmodell")).not.toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Schichtmodell"));
    expect(await screen.findByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Gruppe"));
    expect(await screen.findByLabelText("Gruppe")).toBeChecked();

    fireEvent.click(screen.queryByLabelText("Gruppe"));
    expect(await screen.findByLabelText("Gruppe")).not.toBeChecked();
    expect(screen.queryByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();
  });

  it("should update the shift model and search together", async () => {
    render(
      <ShareMenu
        group={2}
        search={[2020, 4, 5]}
        shiftModel="6-6"
        hide={() => {}}
      />,
    );

    expect(screen.queryByLabelText("Schichtmodell")).not.toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Der gesuchte Tag"));
    expect(await screen.findByLabelText("Der gesuchte Tag")).toBeChecked();
    expect(screen.queryByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Schichtmodell"));
    expect(await screen.findByLabelText("Schichtmodell")).not.toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Schichtmodell"));
    expect(await screen.findByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Der gesuchte Tag")).not.toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();

    fireEvent.click(screen.queryByLabelText("Der gesuchte Tag"));
    expect(await screen.findByLabelText("Der gesuchte Tag")).toBeChecked();

    fireEvent.click(screen.queryByLabelText("Der gesuchte Tag"));
    expect(await screen.findByLabelText("Der gesuchte Tag")).not.toBeChecked();
    expect(screen.queryByLabelText("Schichtmodell")).toBeChecked();
    expect(screen.queryByLabelText("Gruppe")).not.toBeChecked();
  });

  it("should close if the cancel button is clicked", () => {
    const hideCallback = jest.fn();

    render(
      <ShareMenu
        group={0}
        search={null}
        shiftModel="6-6"
        hide={hideCallback}
      />,
    );

    const cancelButton = screen.queryByText("Abbrechen");
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.nodeName).toBe("BUTTON");
    expect(cancelButton).toBeEnabled();

    fireEvent.click(cancelButton);
    expect(hideCallback).toHaveBeenCalled();
  });

  it("should use share if it exist", async () => {
    const hideCallback = jest.fn();
    window.navigator.share = jest.fn(() => Promise.resolve());

    render(
      <ShareMenu
        group={0}
        search={null}
        shiftModel="6-6"
        hide={hideCallback}
      />,
    );

    const shareButton = screen.queryByText("Teilen");

    expect(shareButton.href).toBeUndefined();

    fireEvent.click(shareButton);
    await screen.findByText("Teilen");

    expect(hideCallback).toHaveBeenCalled();
    expect(window.navigator.share).toHaveBeenCalledWith({
      url: new URL("http://localhost/"),
      title: "Schichtkalender",
      text: "Meine Schichten beim Bosch Reutlingen: http://localhost/",
    });

    delete window.navigator.share;
  });

  it("should pass aXe", async () => {
    const { container } = render(
      <ShareMenu group={0} search={null} shiftModel="6-6" hide={() => {}} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
