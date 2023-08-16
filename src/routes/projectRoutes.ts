import express from 'express';
import * as projectController from '../controllers/projectController';
import { asyncWrapper } from '../asyncWrapper';

const router = express.Router();

router.get('/', asyncWrapper(projectController.listProjects));
router.get('/:id', asyncWrapper(projectController.listProject));
router.post('/', asyncWrapper(projectController.createProject));
router.delete('/:id', asyncWrapper(projectController.deleteProject));
router.put('/:id', asyncWrapper(projectController.updateProject));

// ... You can add more routes for update, delete, and add contributors.

export default router;
