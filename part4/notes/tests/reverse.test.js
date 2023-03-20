const reverse = require("../utils/for_testing").reverse;

test("reverse of a", () => {
  const result = reverse("a");
  expect(result).toBe("a");
});

test("reverse of react", () => {
  const result = reverse("react");
  expect(result).toBe("tcaer");
});

test("reverse of amagama", () => {
  const result = reverse("amagama");
  expect(result).toBe("amagama");
});
