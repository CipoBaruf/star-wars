import { cn } from "../utils";

describe("cn utility", () => {
  // Test 1: Combines class names
  it("should combine multiple class names", () => {
    const result = cn("class1", "class2", "class3");
    expect(result).toBe("class1 class2 class3");
  });

  // Test 2: Handles conditional classes
  it("should handle conditional classes", () => {
    const result = cn("base", true && "included", false && "excluded");
    expect(result).toBe("base included");
  });

  // Test 3: Merges Tailwind classes correctly
  it("should merge conflicting Tailwind classes", () => {
    const result = cn("px-4 py-2", "px-6");
    // Should keep the last px value
    expect(result).toContain("px-6");
    expect(result).toContain("py-2");
    expect(result).not.toContain("px-4");
  });

  // Test 4: Handles arrays of classes
  it("should handle arrays of classes", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
    expect(result).toContain("class3");
  });

  // Test 5: Handles objects with boolean values
  it("should handle objects with boolean values", () => {
    const result = cn({
      active: true,
      disabled: false,
      primary: true,
    });
    expect(result).toContain("active");
    expect(result).toContain("primary");
    expect(result).not.toContain("disabled");
  });

  // Test 6: Handles undefined and null
  it("should handle undefined and null values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toBe("base end");
  });

  // Test 7: Handles empty strings
  it("should handle empty strings", () => {
    const result = cn("base", "", "end");
    expect(result).toBe("base end");
  });

  // Test 8: Complex Tailwind merge scenario
  it("should handle complex Tailwind class merging", () => {
    const result = cn(
      "bg-red-500 text-white p-4",
      "bg-blue-500 hover:bg-blue-600"
    );
    expect(result).toContain("bg-blue-500");
    expect(result).not.toContain("bg-red-500");
    expect(result).toContain("text-white");
    expect(result).toContain("p-4");
  });

  // Test 9: No arguments
  it("should handle no arguments", () => {
    const result = cn();
    expect(result).toBe("");
  });

  // Test 10: Complex mixed input
  it("should handle complex mixed input types", () => {
    const result = cn(
      "base",
      ["array1", "array2"],
      { active: true, hidden: false },
      undefined,
      "end"
    );
    expect(result).toContain("base");
    expect(result).toContain("array1");
    expect(result).toContain("array2");
    expect(result).toContain("active");
    expect(result).not.toContain("hidden");
    expect(result).toContain("end");
  });
});
