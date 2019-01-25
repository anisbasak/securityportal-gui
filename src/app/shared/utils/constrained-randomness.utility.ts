/**
 * Utility function for returning a random value, given some variance
 * and min/max constraints
 */
function constrainedRandomness(val: number, variance = 15, min = 0, max = 100): number {
  const minOutput = Math.max(val - variance, min);
  const maxOutput = Math.min(val + variance, max);

  return minOutput < maxOutput ? getRandomInt(minOutput, maxOutput) : NaN;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export { constrainedRandomness };
