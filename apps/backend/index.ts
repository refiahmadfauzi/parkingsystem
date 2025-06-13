import express from 'express';
import cors from 'cors';
import { reservationRoutes } from './routes/reservation'

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', reservationRoutes)

app.get('/api/health', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
