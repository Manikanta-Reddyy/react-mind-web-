import { type Rule } from "../context/usePolygonStore";

export const matchRuleColor = (avg: number, rules: Rule[]): string => {
  for (const rule of rules) {
    const val = rule.value;
    const op = rule.operator;
    if (
      (op === "<" && avg < val) ||
      (op === "<=" && avg <= val) ||
      (op === "=" && avg === val) ||
      (op === ">" && avg > val) ||
      (op === ">=" && avg >= val)
    ) {
      return rule.color;
    }
  }
  return "#cccccc"; // default fallback color
};

