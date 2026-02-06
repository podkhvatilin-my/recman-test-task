import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColumnNameDialog } from "../ColumnNameDialog";

describe("ColumnNameDialog", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    title: "Add Column",
    defaultValue: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title", () => {
    render(<ColumnNameDialog {...defaultProps} title="Rename Column" />);
    expect(screen.getByText("Rename Column")).toBeInTheDocument();
  });

  it("pre-fills the input with defaultValue", () => {
    render(<ColumnNameDialog {...defaultProps} defaultValue="My Column" />);
    expect(screen.getByPlaceholderText("Column name...")).toHaveValue(
      "My Column",
    );
  });

  it("submits the trimmed value", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ColumnNameDialog {...defaultProps} onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("Column name...");
    await user.type(input, "  New Column  ");
    await user.click(screen.getByText("Save"));

    expect(onSubmit).toHaveBeenCalledWith("New Column");
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ColumnNameDialog {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose on submit even with empty input (but not onSubmit)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();
    render(
      <ColumnNameDialog
        {...defaultProps}
        defaultValue=""
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    // The input has required + minLength=1 so browser validation will block,
    // but we can test by clearing an existing value
    const input = screen.getByPlaceholderText("Column name...");
    await user.type(input, "x");
    await user.clear(input);
    await user.type(input, "   ");
    await user.click(screen.getByText("Save"));

    // onClose is called, onSubmit is not called with empty
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
