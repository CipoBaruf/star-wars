import React from "react";
import { render, screen } from "@testing-library/react";
import InfoCard from "../InfoCard";
import type { InfoCardProps } from "@/shared/types";

describe("InfoCard", () => {
  const mockProps: InfoCardProps = {
    title: "Test Card",
    fields: [
      { label: "Name", value: "Luke Skywalker" },
      { label: "Height", value: "172" },
      { label: "Mass", value: "77" },
    ],
  };

  // Test 1: Renders title correctly
  it("should render the title", () => {
    render(<InfoCard {...mockProps} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  // Test 2: Renders all fields
  it("should render all fields with labels and values", () => {
    render(<InfoCard {...mockProps} />);

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Height:")).toBeInTheDocument();
    expect(screen.getByText("172")).toBeInTheDocument();
    expect(screen.getByText("Mass:")).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
  });

  // Test 3: Applies capitalize class when specified
  it("should apply capitalize class to field value when specified", () => {
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Gender", value: "male", capitalize: true }],
    };

    render(<InfoCard {...props} />);
    const valueElement = screen.getByText("male");
    expect(valueElement).toHaveClass("capitalize");
  });

  // Test 4: Does not apply capitalize class by default
  it("should not apply capitalize class by default", () => {
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Name", value: "Luke" }],
    };

    render(<InfoCard {...props} />);
    const valueElement = screen.getByText("Luke");
    expect(valueElement).not.toHaveClass("capitalize");
  });

  // Test 5: Applies text-right class when specified
  it("should apply text-right class when alignRight is true", () => {
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Count", value: "100", alignRight: true }],
    };

    render(<InfoCard {...props} />);
    const valueElement = screen.getByText("100");
    expect(valueElement).toHaveClass("text-right");
  });

  // Test 6: Handles numeric values
  it("should handle numeric values", () => {
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Count", value: 42 }],
    };

    render(<InfoCard {...props} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  // Test 7: Renders empty card with no fields
  it("should render card with no fields", () => {
    const props: InfoCardProps = {
      title: "Empty Card",
      fields: [],
    };

    render(<InfoCard {...props} />);
    expect(screen.getByText("Empty Card")).toBeInTheDocument();
    const fields = screen.queryAllByRole("paragraph");
    expect(fields.length).toBe(0);
  });

  // Test 8: Renders with multiple fields having different options
  it("should render multiple fields with different options", () => {
    const props: InfoCardProps = {
      title: "Mixed Fields",
      fields: [
        { label: "Name", value: "luke" },
        { label: "Gender", value: "male", capitalize: true },
        { label: "Height", value: "172", alignRight: true },
        {
          label: "Hair Color",
          value: "blond",
          capitalize: true,
          alignRight: false,
        },
      ],
    };

    render(<InfoCard {...props} />);

    const nameValue = screen.getByText("luke");
    expect(nameValue).not.toHaveClass("capitalize");

    const genderValue = screen.getByText("male");
    expect(genderValue).toHaveClass("capitalize");

    const heightValue = screen.getByText("172");
    expect(heightValue).toHaveClass("text-right");

    const hairValue = screen.getByText("blond");
    expect(hairValue).toHaveClass("capitalize");
    expect(hairValue).not.toHaveClass("text-right");
  });

  // Test 9: Handles long text values
  it("should handle long text values", () => {
    const longText = "This is a very long text value that might wrap";
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Description", value: longText }],
    };

    render(<InfoCard {...props} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  // Test 10: Has correct semantic structure
  it("should have correct semantic HTML structure", () => {
    const { container } = render(<InfoCard {...mockProps} />);

    // Check for heading
    const heading = container.querySelector("h3");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Card");

    // Check for field container
    const fieldsContainer = container.querySelector(".space-y-2");
    expect(fieldsContainer).toBeInTheDocument();
  });

  // Test 11: Applies hover effect classes
  it("should have hover effect classes", () => {
    const { container } = render(<InfoCard {...mockProps} />);

    const card = container.firstChild;
    expect(card).toHaveClass("group");

    const title = container.querySelector("h3");
    expect(title).toHaveClass("group-hover:text-blue-400");
  });

  // Test 12: Handles special characters in values
  it("should handle special characters in values", () => {
    const props: InfoCardProps = {
      title: "Test",
      fields: [{ label: "Name", value: "Luke's Height & Weight: 172cm/77kg" }],
    };

    render(<InfoCard {...props} />);
    expect(
      screen.getByText("Luke's Height & Weight: 172cm/77kg")
    ).toBeInTheDocument();
  });
});
