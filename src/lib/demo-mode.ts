import "server-only";

export function isStoreTemplateDemoMode() {
  return process.env.STORE_TEMPLATE_HOSTED_DEMO === "true"
    || process.env.STORE_TEMPLATE_DEMO_MODE === "true";
}

export function isHostedStoreTemplateDemo() {
  return process.env.STORE_TEMPLATE_HOSTED_DEMO === "true";
}
