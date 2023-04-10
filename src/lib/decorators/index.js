export function annotation(target) {
  target.annotated = true;
}

export function isTestable(value) {
  return function decorator(target) {
    target.isTestable = value;
  };
}

export function enumerable(value) {
  return function (target, key, descriptor) {
    descriptor.enumerable = value;
    return descriptor;
  };
}
