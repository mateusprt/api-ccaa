import { sum } from "../src/main";

test('Deve somar dois números', () => {
  const result = sum(2, 2)
  expect(result).toBe(4)
})