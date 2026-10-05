import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SettingsSwitch } from "#/components/features/settings/settings-switch";

describe("SettingsSwitch", () => {
  it("should call the onChange handler when the input is clicked", async () => {
    const user = userEvent.setup();
    const onToggleMock = vi.fn();
    render(
      <SettingsSwitch testId="test-switch" onToggle={onToggleMock}>
        Test Switch
      </SettingsSwitch>,
    );

    const switchInput = screen.getByTestId("test-switch");

    await user.click(switchInput);
    expect(onToggleMock).toHaveBeenCalledWith(true);

    await user.click(switchInput);
    expect(onToggleMock).toHaveBeenCalledWith(false);
  });

  it("should be reachable with Tab and toggle with Space", async () => {
    const user = userEvent.setup();
    const onToggleMock = vi.fn();
    render(
      <SettingsSwitch testId="test-switch" onToggle={onToggleMock}>
        Test Switch
      </SettingsSwitch>,
    );

    await user.tab();

    const switchControl = screen.getByRole("switch", { name: "Test Switch" });
    expect(switchControl).toHaveFocus();
    expect(switchControl).not.toBeChecked();

    await user.keyboard(" ");
    expect(onToggleMock).toHaveBeenCalledWith(true);
    expect(switchControl).toBeChecked();
  });

  it("should keep a disabled switch out of the tab order", async () => {
    const user = userEvent.setup();
    const onToggleMock = vi.fn();
    render(
      <SettingsSwitch testId="test-switch" onToggle={onToggleMock} isDisabled>
        Test Switch
      </SettingsSwitch>,
    );

    await user.tab();
    await user.keyboard(" ");

    const switchControl = screen.getByRole("switch", { name: "Test Switch" });
    expect(switchControl).not.toHaveFocus();
    expect(switchControl).toBeDisabled();
    expect(onToggleMock).not.toHaveBeenCalled();
  });

  it("should render a beta tag if isBeta is true", () => {
    const { rerender } = render(
      <SettingsSwitch testId="test-switch" onToggle={vi.fn()} isBeta={false}>
        Test Switch
      </SettingsSwitch>,
    );

    expect(screen.queryByText(/beta/i)).not.toBeInTheDocument();

    rerender(
      <SettingsSwitch testId="test-switch" onToggle={vi.fn()} isBeta>
        Test Switch
      </SettingsSwitch>,
    );

    expect(screen.getByText(/beta/i)).toBeInTheDocument();
  });

  it("should be able to set a default toggle state", async () => {
    const user = userEvent.setup();
    const onToggleMock = vi.fn();
    render(
      <SettingsSwitch
        testId="test-switch"
        onToggle={onToggleMock}
        defaultIsToggled
      >
        Test Switch
      </SettingsSwitch>,
    );

    expect(screen.getByTestId("test-switch")).toBeChecked();

    const switchInput = screen.getByTestId("test-switch");
    await user.click(switchInput);
    expect(onToggleMock).toHaveBeenCalledWith(false);

    expect(screen.getByTestId("test-switch")).not.toBeChecked();
  });
});
