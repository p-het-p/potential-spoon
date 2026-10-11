import { Router } from 'express';
import { eventController } from '../controllers/event.controller.js';
import { validate } from '../middleware/validate.js';
import { createEventSchema, updateEventSchema, getEventsSchema } from '../schemas/event.schema.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { clubLeaderOnly } from '../middleware/authorize.js';

const router = Router();

// Public: List public events (includes private/past for club_leader)
router.get(
  '/',
  optionalAuthenticate,
  validate(getEventsSchema),
  (req, res, next) => eventController.getEvents(req, res).catch(next)
);

// Public: Get event details
router.get(
  '/:id',
  (req, res, next) => eventController.getEventById(req, res).catch(next)
);

// Club leader only: Create event
router.post(
  '/',
  authenticate,
  clubLeaderOnly,
  validate(createEventSchema),
  (req, res, next) => eventController.createEvent(req, res).catch(next)
);

// Club leader only: Update event
router.patch(
  '/:id',
  authenticate,
  clubLeaderOnly,
  validate(updateEventSchema),
  (req, res, next) => eventController.updateEvent(req, res).catch(next)
);

// Club leader only: Delete event
router.delete(
  '/:id',
  authenticate,
  clubLeaderOnly,
  (req, res, next) => eventController.deleteEvent(req, res).catch(next)
);

export default router;
