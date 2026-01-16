import express from "express"
import {body} from "express-validator"
import {signup, login} from './user.controller.js'
const router = express.Router()

router.post('/register', signup)
router.post('/login', login)

export default router