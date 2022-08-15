export function uid() {
  return new Date().getTime();
}

export function tick(callback: () => void) {
  setTimeout(() => {
    callback();
  }, 0);
}
