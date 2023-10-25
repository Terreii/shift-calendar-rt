import { strict as assert } from "node:assert";
import { test } from "node:test";

test("it works", async (t) => {
  await t.test("sub test 1", () => {
    assert.ok(true);
  });
});
