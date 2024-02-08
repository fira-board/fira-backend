import express from "express";
import * as userController from "../controllers/userController";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import multer from 'multer';

const router = express.Router();
//upload only images png jpg jpeg max 5mb  5*1024*1024
const upload = multer({ dest: 'uploads/' , limits: { fileSize: 5*1024*1024 }, fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}});

router.get("/user/", verifySession(), userController.getUserDetails);
router.put("/user/", verifySession(), userController.editUserDetails);
router.post("/user/profilePicture", verifySession(), upload.single('profilePicture'),userController.uploadProfilePicture);

export default router;