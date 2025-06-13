import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ name: '', vehicleNumber: '', slotId: '', date: '', start: '', end: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/parking-slots').then(res => setSlots(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/reservations', {
      name: form.name,
      vehicleNumber: form.vehicleNumber,
      reservationDate: form.date,
      startTime: form.start,
      endTime: form.end,
      parkingSlotId: form.slotId,
    });
    alert('Reservation created!');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Parking Slot Reservation</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" className="border p-2 w-full" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="Vehicle Number" className="border p-2 w-full" onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} />
        <select className="border p-2 w-full" onChange={e => setForm({ ...form, slotId: e.target.value })}>
          <option>Select Slot</option>
          {slots.map(slot => (
            <option key={slot?.id} value={slot.id}>{slot.slotCode} - {slot.location}</option>
          ))}
        </select>
        <input type="date" className="border p-2 w-full" onChange={e => setForm({ ...form, date: e.target.value })} />
        <input type="time" className="border p-2 w-full" onChange={e => setForm({ ...form, start: e.target.value })} />
        <input type="time" className="border p-2 w-full" onChange={e => setForm({ ...form, end: e.target.value })} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Reserve</button>
      </form>
    </div>
  );
}
