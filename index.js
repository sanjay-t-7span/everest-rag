
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', searchRoutes);

app.get('/', (req, res) => {
    res.send('Everest RAG Server is runnning');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
