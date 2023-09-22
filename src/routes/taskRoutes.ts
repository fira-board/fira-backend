import express from 'express';
import * as taskController from '../controllers/taskController';
import { asyncWrapper } from '../asyncWrapper';

const router = express.Router();

router.get('/', asyncWrapper(taskController.listTasks));
router.get('/:id', asyncWrapper(taskController.getTask));
router.post('/', asyncWrapper(taskController.createTask));
router.delete('/:id', asyncWrapper(taskController.deleteTask));
router.put('/:id', asyncWrapper(taskController.updateTask));

// ... You can add more routes for update, delete, and add contributors.

export default router;
