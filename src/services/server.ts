let timestamp = 0 as number;

setInterval(() => {
  timestamp++;
}, 1000);

function getTimestamp(): number {
  return timestamp;
}

export { getTimestamp };
