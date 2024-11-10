const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === "production";
  
    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });
  
    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

// codes to check authentication and authorization roles
// const requireAuthorization = (requiredRoles = []) => {
//   return (req, res, next) => {
//     // Step 1: Check if the user is authenticated (user exists)
//     if (!req.user) {
//       const err = new Error('Authentication required');
//       err.title = 'Authentication required';
//       err.errors = { message: 'Authentication required' };
//       err.status = 401; // Unauthorized
//       return next(err); // Pass the error to the error handler
//     }

//     // Step 2: Check if the user has the required roles
//     if (!req.user.roles || !Array.isArray(req.user.roles)) {
//       const err = new Error('User roles are missing or invalid');
//       err.title = 'User roles missing';
//       err.errors = { message: 'User roles are missing or invalid' };
//       err.status = 403; // Forbidden
//       return next(err);
//     }

//     // If no required roles are passed, allow access
//     if (requiredRoles.length === 0) {
//       return next();
//     }

//     // Check if the user has at least one of the required roles
//     const hasRequiredRole = requiredRoles.some(role => req.user.roles.includes(role));

//     if (!hasRequiredRole) {
//       const err = new Error('Forbidden');
//       err.title = 'Forbidden';
//       err.errors = { message: 'Forbidden' };
//       err.status = 403; // Forbidden
//       return next(err); // Pass the error to the error handler
//     }

//     // Step 3: If the user has the correct role(s), allow them to proceed
//     return next(); // Continue with the request
//   };
// };


module.exports = { setTokenCookie, restoreUser, requireAuth };