/**
 * Calculate the status of attendance.
 * 
 * @param {number} attended - Classes attended so far.
 * @param {number} total - Total classes conducted so far.
 * @param {number} targetPct - Target percentage (e.g., 75 for 75%).
 * @returns {object} - Status object with details.
 */
export function calculateAttendance(attended, total, targetPct = 75) {
  const currentPct = total === 0 ? 0 : (attended / total) * 100;
  const targetFraction = targetPct / 100;

  // How many more continuous classes needed to reach target?
  // Formula: (attended + x) / (total + x) >= target
  // x >= (target * total - attended) / (1 - target)
  
  let needed = 0;
  let bunkable = 0;
  let status = 'safe'; // safe, warning, danger

  if (currentPct < targetPct) {
    status = 'danger';
    const numerator = (targetFraction * total) - attended;
    const denominator = 1 - targetFraction;
    needed = Math.ceil(numerator / denominator);
    
    // Edge case: if needed is very small (like 0 but current < target due to rounding? No, math handles it)
    if (needed < 0) needed = 0; 
  } else {
    // Determine how many we can bunk
    // (attended) / (total + y) >= target
    // y <= (attended / target) - total
    status = 'safe';
    bunkable = Math.floor((attended / targetFraction) - total);
    if (bunkable < 0) bunkable = 0;
  }

  return {
    currentPct: parseFloat(currentPct.toFixed(2)),
    needed,
    bunkable,
    status, // 'safe' or 'danger' relative to target
    riskLevel: getRiskLevel(currentPct, targetPct)
  };
}

function getRiskLevel(current, target) {
  if (current >= target + 10) return "Low Risk";
  if (current >= target) return "Moderate Risk";
  if (current >= target - 5) return "High Risk";
  return "Critical Risk 🚨";
}
