export const extend = Object.assign;

export function isObject(value) {
  return value !== null && typeof value === "object";
}

export function hasChange(value, newValue) {
  return !Object.is(value, newValue);
}
