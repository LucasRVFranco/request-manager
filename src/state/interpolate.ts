import type { KeyValueRow } from "../types";

const VARIABLE_PATTERN = /\{\{\s*([\w.-]+)\s*\}\}/g;

export function interpolate(input: string, variables: KeyValueRow[]): string {
  if (!input) return input;
  const map = new Map(variables.filter((v) => v.enabled && v.key).map((v) => [v.key, v.value]));
  return input.replace(VARIABLE_PATTERN, (match, key) => (map.has(key) ? map.get(key)! : match));
}
