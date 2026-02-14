export const calculateObservationPoints = (observation) => {
  if (!observation) return 0;

  // 1. Steps: +1 per step checked (max 6)
  const steps = observation.hygieneSteps || {};
  const stepKeys = [
    'rub_palm_to_palm',
    'rub_right_dorsum_left_palm',
    'rub_palm_to_palm_interlaced',
    'rub_backs_fingers',
    'rub_thumb_rotation',
    'rub_fingers_rotation',
  ];
  const stepsPoints = stepKeys.filter(key => steps[key] === true).length;

  // 2. Time compliance: +1 if duration meets the threshold
  let timePoint = 0;
  const duration = observation.duration || 0;
  if (observation.action === 'rub' && duration > 20) {
    timePoint = 1;
  } else if (observation.action === 'wash' && duration > 40) {
    timePoint = 1;
  }

  // 3. Risk factors: -1 per risk factor present
  const risks = observation.riskFactors || {};
  const riskKeys = ['jewellery', 'watch', 'ring', 'long_nails'];
  const riskDeduction = riskKeys.filter(key => risks[key] === true).length;

  // Final score (floored at 0)
  return Math.max(0, stepsPoints + timePoint - riskDeduction);
};

// Calculate total points for user
export const calculateTotalPoints = (observations) => {
  if (!observations || observations.length === 0) return 0;
  
  const total = observations.reduce((sum, obs) => {
    return sum + calculateObservationPoints(obs);
  }, 0);
  
  return parseFloat(total.toFixed(2));
};

// Calculate compliance rate
export const calculateComplianceRate = (observations) => {
  if (!observations || observations.length === 0) return 0;
  
  const adherentCount = observations.filter(obs => obs.adherence === 'adherence').length;
  const rate = (adherentCount / observations.length) * 100;
  
  return parseFloat(rate.toFixed(1));
};

// Determine badge level based on points
export const getBadgeLevel = (points) => {
  if (points >= 500) return 'platinum';
  if (points >= 200) return 'gold';
  if (points >= 100) return 'silver';
  if (points >= 50) return 'bronze';
  return null;
};

// Calculate rank change
export const calculateRankChange = (previousRank, currentRank) => {
  if (!previousRank || !currentRank) return 0;
  return previousRank - currentRank;
};
