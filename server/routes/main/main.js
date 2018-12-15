import { Router } from 'express';
import * as mainController from '../../controllers/main/main';

const router = new Router();


router.route('/').get(mainController.indexPage);

export default router;