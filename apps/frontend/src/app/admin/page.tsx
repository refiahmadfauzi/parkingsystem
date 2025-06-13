'use client'

import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

type Reservation = {
  bookingCode: string
  name: string
  vehicleNumber: string
  reservationDate: string
  startTime: string
  endTime: string
  status: string
  parkingSlot: {
    slotCode: string
    location: string
  }
}

export default function AdminReservationPanel() {
  const [code, setCode] = useState('')
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [error, setError] = useState('')

  const searchReservation = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/reservations/booking/${code}`)
      setReservation(res.data)
      setError('')
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Not Found',
        text: 'Booking code not found!',
      })
      setReservation(null)
     
    }
  }

  const handleMarkAsPaid = async () => {
    const confirm = await Swal.fire({
      title: 'Mark as Paid?',
      text: 'This will confirm the payment and update the status.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel',
    })

    if (confirm.isConfirmed) {
      try {
        const res = await axios.put(`http://localhost:5000/api/reservations/booking/${code}/pay`)
        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed',
          text: 'Reservation status has been updated to done.',
        })
        setReservation(res.data.updated)
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not update reservation status.',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-cyan-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Admin - Search Booking</h2>

        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Enter Booking Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="flex-1 border p-2 rounded-md"
          />
          <button
            onClick={searchReservation}
            className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {reservation && (
          <div className="border p-4 rounded-md bg-gray-100 text-black">
            <p><strong>Booking Code:</strong> {reservation.bookingCode}</p>
            <p><strong>Name:</strong> {reservation.name}</p>
            <p><strong>Vehicle:</strong> {reservation.vehicleNumber}</p>
            <p><strong>Date:</strong> {reservation.reservationDate}</p>
            <p><strong>Time:</strong> {reservation.startTime} - {reservation.endTime}</p>
            <p><strong>Location:</strong> {reservation.parkingSlot.location} - {reservation.parkingSlot.slotCode}</p>
            <p><strong>Status:</strong> {reservation.status}</p>

            {reservation.status !== 'done' && (
              <button
                onClick={handleMarkAsPaid}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
              >
                Paid (Cash)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
