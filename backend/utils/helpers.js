// Calculate points for observation
// Points = (count of hygiene steps checked) + (1 if time compliant) - (count of risk factors)
// Minimum 0, Maximum 7
export const calculatePoints = (observation) => {
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

// Determine badge level
export const determineBadgeLevel = (totalPoints) => {
  if (totalPoints >= 500) return 'platinum';
  if (totalPoints >= 200) return 'gold';
  if (totalPoints >= 100) return 'silver';
  if (totalPoints >= 50) return 'bronze';
  return null;
};

// Calculate compliance rate
export const calculateComplianceRate = (observations) => {
  if (!observations || observations.length === 0) return 0;

  const adherentCount = observations.filter(
    obs => obs.adherence === 'adherence'
  ).length;

  return parseFloat(((adherentCount / observations.length) * 100).toFixed(1));
};

// Pagination helper
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

// Format pagination response
export const formatPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
