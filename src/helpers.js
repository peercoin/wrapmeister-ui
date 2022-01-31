export function debounce(fn, delay) {
  let timeoutID = null;
  return function() {
    clearTimeout(timeoutID);
    let args = arguments;
    let that = this;
    timeoutID = setTimeout(function() {
      fn.apply(that, args);
    }, delay);
  };
}

export function roundTo(x, digits) {
  const power = 10 ** digits;
  return Math.round((x + Number.EPSILON) * power) / power;
}
