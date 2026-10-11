import { Router } from 'express';
import * as leaderController from '../controllers/leader.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { clubLeaderOnly } from '../middleware/authorize.js';

const router = Router();

// Fundraisers
router.post('/fundraisers', authenticate, clubLeaderOnly, (req, res, next) => leaderController.createFundraiser(req, res).catch(next));
router.get('/fundraisers', optionalAuthenticate, (req, res, next) => leaderController.getFundraisers(req, res).catch(next));
router.patch('/fundraisers/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.updateFundraiser(req, res).catch(next));
router.delete('/fundraisers/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.deleteFundraiser(req, res).catch(next));

// Volunteer Tasks
router.post('/tasks', authenticate, clubLeaderOnly, (req, res, next) => leaderController.createVolunteerTask(req, res).catch(next));
router.get('/tasks', authenticate, (req, res, next) => leaderController.getVolunteerTasks(req, res).catch(next));
router.patch('/tasks/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.updateVolunteerTask(req, res).catch(next));
router.delete('/tasks/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.deleteVolunteerTask(req, res).catch(next));

// Announcements (Public / Member / Leader view)
router.post('/announcements', authenticate, clubLeaderOnly, (req, res, next) => leaderController.createAnnouncement(req, res).catch(next));
router.get('/announcements', optionalAuthenticate, (req, res, next) => leaderController.getAnnouncements(req, res).catch(next));
router.patch('/announcements/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.updateAnnouncement(req, res).catch(next));
router.delete('/announcements/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.deleteAnnouncement(req, res).catch(next));

// Members Management
router.get('/members', authenticate, clubLeaderOnly, (req, res, next) => leaderController.getMembers(req, res).catch(next));
router.patch('/members/:id', authenticate, clubLeaderOnly, (req, res, next) => leaderController.updateMemberStatus(req, res).catch(next));
router.get('/volunteers', authenticate, clubLeaderOnly, (req, res, next) => leaderController.getAssignableUsers(req, res).catch(next));

// Merch Orders & Stats
router.get('/merch-orders', authenticate, clubLeaderOnly, (req, res, next) => leaderController.getMerchOrders(req, res).catch(next));
router.get('/stats', authenticate, clubLeaderOnly, (req, res, next) => leaderController.getLeaderStats(req, res).catch(next));

export default router;

