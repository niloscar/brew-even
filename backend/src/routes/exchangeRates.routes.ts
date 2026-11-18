
import { Router } from 'express'
import { handleGetExchangeRates } from '../controllers/exchangeRates.controller.ts'

const router = Router()

router.get('/', handleGetExchangeRates)

export default router
