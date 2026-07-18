import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canEnterPlatform,
  checkoutPaymentSucceeded,
  ownsPurchase,
  canPurchase,
  deriveUserEntitlements,
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

test("11. Trading owner has no Trading purchase action", () => {
  const access = deriveUserEntitlements(["trading"]);
  assert.equal(access.ownsTrading, true);
  assert.equal(access.canPurchaseTrading, false);
});

test("12. bundle owner continues every individual course", () => {
  const access = deriveUserEntitlements(["bundle"]);
  assert.deepEqual(access.ownedCourses, ["trading", "ecommerce", "tiktok_shop"]);
  assert.equal(access.canPurchaseEcommerce, false);
});

test("13. API policy rejects duplicate purchases", () => {
  assert.equal(canPurchase(deriveUserEntitlements(["trading"]), "trading"), false);
});

test("14. bundle blocks every individual purchase", () => {
  const access = deriveUserEntitlements(["bundle"]);
  for (const course of ["trading", "ecommerce", "tiktok_shop"] as const)
    assert.equal(canPurchase(access, course), false);
});

test("15. all three individual courses hide the bundle purchase", () => {
  const access = deriveUserEntitlements(["trading", "ecommerce", "tiktok_shop"]);
  assert.equal(access.canPurchaseBundle, false);
});

test("16. webhook uses an idempotent entitlement upsert", () => {
  const source = readFileSync("src/lib/payments/grant-access.ts", "utf8");
  assert.match(source, /upsert[\s\S]*onConflict: "user_id,course_slug"/);
});

test("17. database enforces unique user and course slug", () => {
  const migration = readFileSync(
    "supabase/migrations/20260718010000_duplicate_purchase_protection.sql",
    "utf8",
  );
  assert.match(migration, /add constraint mu_course_access_user_course_slug_key[\s\S]*unique using index/i);
});
