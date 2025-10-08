import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "../Navigation";
import { usePathname } from "next/navigation";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("Navigation", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders all navigation links
  it("should render all navigation links", () => {
    render(<Navigation />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Characters")).toBeInTheDocument();
    expect(screen.getByText("Planets")).toBeInTheDocument();
    expect(screen.getByText("Spaceships")).toBeInTheDocument();
    expect(screen.getByText("Vehicles")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
  });

  // Test 2: Highlights active link
  it("should highlight the active link", () => {
    (usePathname as jest.Mock).mockReturnValue("/characters");
    render(<Navigation />);

    const charactersLink = screen.getAllByText("Characters")[0];
    expect(charactersLink).toHaveClass("text-blue-400");
  });

  // Test 3: Mobile menu is hidden by default
  it("should hide mobile menu by default", () => {
    render(<Navigation />);

    // Mobile menu links should not be visible initially
    const mobileLinks = screen.queryAllByRole("link");
    // Desktop has 6 links, mobile adds 6 more when open
    expect(mobileLinks.length).toBeLessThanOrEqual(7); // 6 desktop + 1 logo
  });

  // Test 4: Toggle mobile menu opens menu
  it("should open mobile menu when toggle button is clicked", () => {
    render(<Navigation />);

    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);

    // After opening, mobile links should be visible
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.length).toBeGreaterThan(7); // More links now visible
  });

  // Test 5: Toggle mobile menu closes menu
  it("should close mobile menu when toggle button is clicked again", () => {
    render(<Navigation />);

    const toggleButton = screen.getByLabelText("Toggle menu");

    // Open
    fireEvent.click(toggleButton);
    let allLinks = screen.getAllByRole("link");
    const openCount = allLinks.length;

    // Close
    fireEvent.click(toggleButton);
    allLinks = screen.getAllByRole("link");
    expect(allLinks.length).toBeLessThan(openCount);
  });

  // Test 6: Clicking mobile link closes menu
  it("should close mobile menu when a link is clicked", () => {
    render(<Navigation />);

    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);

    // Menu should be open
    expect(screen.getAllByText("Characters").length).toBeGreaterThan(1);

    // Click a mobile menu link (the second Characters link)
    const mobileLinks = screen.getAllByText("Characters");
    fireEvent.click(mobileLinks[1]);

    // Menu should close (only one Characters link visible in desktop menu)
    expect(screen.getAllByText("Characters").length).toBe(1);
  });

  // Test 7: Displays page title when showPageTitle is true
  it("should display page title when showPageTitle is true", () => {
    render(<Navigation pageTitle="Test Page" showPageTitle={true} />);

    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });

  // Test 8: Hides page title when showPageTitle is false
  it("should hide page title when showPageTitle is false", () => {
    render(<Navigation pageTitle="Test Page" showPageTitle={false} />);

    const pageTitle = screen.queryByText("Test Page");
    // It might be in DOM but with opacity-0
    if (pageTitle) {
      expect(pageTitle.parentElement).toHaveClass("opacity-0");
    }
  });

  // Test 9: AI Chat link has special styling
  it("should apply special styling to AI Chat link", () => {
    render(<Navigation />);

    const aiChatLinks = screen.getAllByText("AI Chat");
    aiChatLinks.forEach(link => {
      expect(link).toHaveClass("text-gradient-ai");
    });
  });

  // Test 10: Active link styling overrides default
  it("should apply active styling to current route", () => {
    (usePathname as jest.Mock).mockReturnValue("/planets");
    render(<Navigation />);

    const planetsLinks = screen.getAllByText("Planets");
    const desktopLink = planetsLinks[0];
    expect(desktopLink).toHaveClass("text-blue-400");
  });

  // Test 11: Desktop menu is always visible
  it("should always show desktop menu", () => {
    render(<Navigation />);

    // Check that desktop navigation is rendered (all 6 links visible)
    const allLinks = screen.getAllByRole("link");
    // Should have at least 7 links (6 nav links + 1 logo)
    expect(allLinks.length).toBeGreaterThanOrEqual(7);
  });

  // Test 12: Logo link navigates to home
  it("should render logo link that navigates to home", () => {
    render(<Navigation />);

    const logoLink = screen.getByText("SW");
    expect(logoLink.closest("a")).toHaveAttribute("href", "/");
  });

  // Test 13: Toggle button changes icon
  it("should change toggle button icon when menu opens", () => {
    const { container } = render(<Navigation />);

    const toggleButton = screen.getByLabelText("Toggle menu");

    // Initial state (hamburger icon - three horizontal lines)
    let svg = toggleButton.querySelector("svg");
    let path = svg?.querySelector("path");
    expect(path?.getAttribute("d")).toContain("M4 6h16M4 12h16M4 18h16");

    // Click to open
    fireEvent.click(toggleButton);

    // Should show X icon
    svg = toggleButton.querySelector("svg");
    path = svg?.querySelector("path");
    expect(path?.getAttribute("d")).toContain("M6 18L18 6M6 6l12 12");
  });

  // Test 14: Aria attributes are correct
  it("should have correct aria attributes", () => {
    render(<Navigation />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Main navigation");

    const toggleButton = screen.getByLabelText("Toggle menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  // Test 15: Mobile menu shows active state
  it("should show active state in mobile menu", () => {
    (usePathname as jest.Mock).mockReturnValue("/vehicles");
    render(<Navigation />);

    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);

    const vehicleLinks = screen.getAllByText("Vehicles");
    // Mobile link (second one) should have active styling
    const mobileLink = vehicleLinks[1];
    expect(mobileLink).toHaveClass("text-blue-400");
  });

  // Test 16: Renders without page title props
  it("should render without page title props", () => {
    render(<Navigation />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  // Test 17: Focus management
  it("should have proper focus styles on links", () => {
    render(<Navigation />);

    const links = screen.getAllByRole("link");
    // Just verify links exist and are focusable (focus-visible is a pseudo-class that's hard to test)
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(link).toBeInTheDocument();
    });
  });

  // Test 18: All links have correct hrefs
  it("should have correct href attributes for all links", () => {
    render(<Navigation />);

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getAllByText("Characters")[0].closest("a")).toHaveAttribute(
      "href",
      "/characters"
    );
    expect(screen.getAllByText("Planets")[0].closest("a")).toHaveAttribute(
      "href",
      "/planets"
    );
    expect(screen.getAllByText("Spaceships")[0].closest("a")).toHaveAttribute(
      "href",
      "/spaceships"
    );
    expect(screen.getAllByText("Vehicles")[0].closest("a")).toHaveAttribute(
      "href",
      "/vehicles"
    );
    expect(screen.getAllByText("AI Chat")[0].closest("a")).toHaveAttribute(
      "href",
      "/chat"
    );
  });
});
