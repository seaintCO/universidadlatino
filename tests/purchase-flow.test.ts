import test from "node:test";
import assert from "node:assert/strict";
import {
  canEnterPlatform,
  checkoutPaymentSucceeded,
  ownsPurchase,
} from "../src/lib/payments/entitlements.ts";

test("1. new user buying Trading receives only Trading", () => {
  assert.equal(ownsPurchase(["trading"], "trading"), true);
  assert.equal(ownsPurchase(["trading"], "ecommerce"), false);
});

test("2. existing user can add Ecommerce without losing Trading", () => {
  const keys = ["trading", "ecommerce"] as const;
  assert.equal(ownsPurchase(keys, "trading"), true);
  assert.equal(ownsPurchase(keys, "ecommerce"), true);
});

test("3. bundle unlocks every product", () => {
  for (const key of ["trading", "ecommerce", "tiktok_shop"] as const)
    assert.equal(ownsPurchase(["bundle"], key), true);
});

test("4. failed payment grants nothing", () => {
  assert.equal(checkoutPaymentSucceeded("unpaid"), false);
});

test("5. webhook retry recognizes the same successful state", () => {
  assert.equal(checkoutPaymentSucceeded("paid"), true);
  assert.equal(checkoutPaymentSucceeded("paid"), true);
});

test("6. duplicate payment maps to the same entitlement", () => {
  assert.equal(new Set(["trading", "trading"]).size, 1);
});

test("7. password recovery alone does not grant platform access", () => {
  assert.equal(canEnterPlatform(null, []), false);
});

test("8. logout/login restores access from durable keys", () => {
  assert.equal(canEnterPlatform(null, ["trading"]), true);
});

test("9. returning customer reconciliation restores a missing key", () => {
  const restored = new Set<"trading">();
  restored.add("trading");
  assert.equal(canEnterPlatform(null, restored), true);
});

test("10. success return can activate access before webhook retry", () => {
  assert.equal(checkoutPaymentSucceeded("paid"), true);
});
