import express from 'express';
import * as projectController from '../controllers/projectController';

const router = express.Router();

router.get('/', projectController.listProjects);
router.get('/:id', projectController.listProject);
router.post('/', projectController.createProject);
router.delete('/:id', projectController.deleteProject);
router.put('/:id', projectController.updateProject);

// ... You can add more routes for update, delete, and add contributors.

export default router;
