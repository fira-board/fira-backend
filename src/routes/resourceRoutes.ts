import express from 'express';
import * as resourceController from '../controllers/resourceController';
import { asyncWrapper } from '../asyncWrapper';

const router = express.Router();

router.get('/', asyncWrapper(resourceController.listResources));
router.get('/:id', asyncWrapper(resourceController.listResource));
router.post('/', asyncWrapper(resourceController.createResource));
router.delete('/:id', asyncWrapper(resourceController.deleteResource));
router.put('/:id', asyncWrapper(resourceController.updateResource));

// ... You can add more routes for update, delete, and add contributors.

export default router;
