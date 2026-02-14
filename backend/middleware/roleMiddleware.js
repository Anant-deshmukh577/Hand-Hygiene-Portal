// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
  }
};

// Check if user is auditor or admin
export const isAuditor = (req, res, next) => {
  if (req.user && (req.user.role === 'auditor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Auditor or Admin only.',
    });
  }
};

// Check if user is staff, auditor, or admin (any authenticated user)
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
};