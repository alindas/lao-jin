export function debounce(fn, delay) {
  let time = null;
  return function() {
    if (time) {
      clearTimeout(time);
      time = null;
    }
    time = setTimeout(fn, delay);
  };
}

export function throttle(fn, delay) {
  let time = true;
  return function() {
    if (!time) {
      return false;
    }
    time = false;
    setTimeout(() => {
      fn();
      time = true;
    }, delay);
  }
}