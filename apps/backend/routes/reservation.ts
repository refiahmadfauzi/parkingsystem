import { Router } from 'express'
import { getSlots, reserveSlot, getReservationByBookingCode,markReservationAsPaid } from '../controllers/reservationController'

const router = Router()

router.get('/slots', getSlots)
router.post('/reserve', reserveSlot)
router.post('/reservations/booking/:code', getReservationByBookingCode)
router.patch('/reservations/booking/:code/pay', markReservationAsPaid)

export { router as reservationRoutes }
