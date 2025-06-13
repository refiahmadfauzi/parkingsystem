'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

type ParkingSlot = {
  id: string
  slotCode: string
  location: string
  isAvailable: boolean
}

export default function ParkingReservation() {
  const [slots, setSlots] = useState<ParkingSlot[]>([])
  const [form, setForm] = useState({
    parkingSlotId: '',
    name: '',
    vehicleNumber: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  useEffect(() => {
    axios.get('http://localhost:5000/api/slots')
      .then(res => {
        const availableSlots = res.data.filter((slot: ParkingSlot) => slot.isAvailable)
        setSlots(availableSlots)
      })
      .catch(err => console.error(err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    const {
      name, vehicleNumber, reservationDate,
      startTime, endTime, parkingSlotId,
      cardNumber, expiry, cvv
    } = form

    if (!name || !vehicleNumber || !reservationDate || !startTime || !endTime || !parkingSlotId) {
      Swal.fire({
        icon: 'warning',
        title: 'Sorry',
        text: 'Please complete all reservation details.',
      });
      return
    }

    try {
      const res = await axios.post('http://localhost:5000/api/reserve', {
        name,
        vehicleNumber,
        reservationDate,
        startTime,
        endTime,
        parkingSlotId
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Reservation successful! Booking Code: ${res.data.bookingCode} Please Screenshoot this Code book`,
      });
    } catch (error: any) {
      alert('Error: ' + error?.response?.data?.error || error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-cyan-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl  font-bold text-center mb-6">Online Parking Reservation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <select
            name="parkingSlotId"
            value={form.parkingSlotId}
            onChange={handleChange}
            className="p-2 border rounded-md text-black"
          >
            <option value="">Select Slot</option>
            {slots.map(slot => (
              <option key={slot.id} value={slot.id}>
                {slot.slotCode} - {slot.location}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />

          <input
            type="text"
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />

          <input
            type="date"
            name="reservationDate"
            value={form.reservationDate}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />

          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />

          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
        </div>


        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700"
        >
          Reserve Slot
        </button>
      </div>
    </div>
  )
}
