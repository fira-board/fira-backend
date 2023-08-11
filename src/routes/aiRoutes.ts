import express from 'express';
import * as aiController from '../controllers/aiController';



const router = express.Router();

router.post('/', aiController.generateProjectPlan);


export default router;