import { Router } from 'express'
import { handleCreateSupportCheckout, handleGetSupportCheckoutStatus } from '../controllers/support.controller.ts'

const router = Router()

router.post('/checkout', handleCreateSupportCheckout)
router.get('/checkout/:id', handleGetSupportCheckoutStatus)

export default router
