import { Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()


export const getSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const slots = await prisma.parkingSlot.findMany({
      include: { reservations: true }
    })
    res.json(slots)
  } catch (error) {
    res.status(500).json({ error: 'Error' })
  }
}

export const reserveSlot = async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    vehicleNumber,
    reservationDate,
    startTime,
    endTime,
    parkingSlotId,
  } = req.body

  try {
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: parkingSlotId }
    })

    if (!slot || !slot.isAvailable) {
      res.status(400).json({ error: 'Slot not available' })
      return
    }


    const startDateTime = new Date(`${reservationDate}T${startTime}:00`);
    const endDateTime = new Date(`${reservationDate}T${endTime}:00`);

    const reservation = await prisma.reservation.create({
      data: {
        bookingCode: `BOOK-${Date.now()}`,
        name,
        vehicleNumber,
        reservationDate: new Date(reservationDate),
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'reserved',
        paymentVerifiedAt: null,
        parkingSlotId: parkingSlotId // ✅ cukup isi ID-nya saja
      }
    });


    // Set slot to unavailable
    await prisma.parkingSlot.update({
      where: { id: parkingSlotId },
      data: { isAvailable: false }
    })

    

    res.status(200).json(reservation)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

// Cari reservation berdasarkan bookingCode
export const getReservationByBookingCode = async (req: Request, res: Response): Promise<void>  => {
  const { code } = req.params

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { bookingCode: code },
      include: {
        parkingSlot: true
      }
    })

    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found' })
    }

    res.json(reservation)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch reservation' })
  }
}

// Bayar cash (ubah status jadi "done")
export const markReservationAsPaid = async (req: Request, res: Response) => {
  const { code } = req.params

  try {
    const updated = await prisma.reservation.update({
      where: { bookingCode: code },
      data: {
        status: 'done',
        paymentVerifiedAt: new Date()
      }
    })

    res.json({ message: 'Reservation paid successfully', updated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update reservation' })
  }
}


