import express from 'express';
import * as projectController from '../controllers/projectController';

const router = express.Router();

router.get('/', projectController.listProjects);
router.post('/', projectController.createProject);

// ... You can add more routes for update, delete, and add contributors.

export default router;
