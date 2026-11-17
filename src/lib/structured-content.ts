import { z } from "zod";

const requiredLocalizedText = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalLocalizedText = (maximum: number) => z.string().trim().max(maximum).transform((value) => value || undefined);

export const bilingualSpecificationSchema = z.object({
  labelAr: requiredLocalizedText(80),
  labelEn: requiredLocalizedText(80),
  valueAr: requiredLocalizedText(240),
  valueEn: requiredLocalizedText(240),
}).strict();

export const bilingualSpecificationsSchema = z.array(bilingualSpecificationSchema).max(20).superRefine((items, context) => {
  const labels = new Set<string>();
  items.forEach((item, index) => {
    const identity = `${item.labelAr.toLocaleLowerCase("ar-SY")}\u0000${item.labelEn.toLocaleLowerCase("en-US")}`;
    if (labels.has(identity)) context.addIssue({ code: "custom", path: [index], message: "Duplicate specification label." });
    labels.add(identity);
  });
});

export const serviceHighlightsSchema = z.array(z.object({
  titleAr: requiredLocalizedText(120),
  titleEn: requiredLocalizedText(120),
  descriptionAr: optionalLocalizedText(500),
  descriptionEn: optionalLocalizedText(500),
}).strict()).max(20);

export const serviceWorkflowStepsSchema = z.array(z.object({
  titleAr: requiredLocalizedText(120),
  titleEn: requiredLocalizedText(120),
  descriptionAr: requiredLocalizedText(1_000),
  descriptionEn: requiredLocalizedText(1_000),
}).strict()).max(20);
