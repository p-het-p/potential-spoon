import { AppError } from './errorHandler.js';
// Role authorization middleware
export function authorize(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            throw new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource');
        }
        next();
    };
}
// Check if user is the owner of a resource
export function isResourceOwner(userIdParam = 'userId') {
    return (req, _res, next) => {
        if (!req.user) {
            throw new AppError(401, 'UNAUTHORIZED', 'Authentication required');
        }
        const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
        if (resourceUserId && resourceUserId !== req.user.userId) {
            throw new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource');
        }
        next();
    };
}
// Treasurer only
export const treasurerOnly = authorize('treasurer');
// Treasurer or Leader
export const treasurerOrLeader = authorize('treasurer', 'club_leader');
// Club leader only
export const clubLeaderOnly = authorize('club_leader');
// Volunteer or higher
export const volunteerOrHigher = authorize('volunteer', 'club_leader', 'treasurer');
// Member or higher (all authenticated users)
export const memberOrHigher = authorize('member', 'volunteer', 'club_leader', 'treasurer');
//# sourceMappingURL=authorize.js.map