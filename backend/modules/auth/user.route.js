import express from "express"
import {body} from "express-validator"

const router = express.Router()

router.post('/register', body('email').isEmail(), body('password').isLength())

export default router