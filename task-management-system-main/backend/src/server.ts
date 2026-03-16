import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

import authRouter from './auth/auth.routes';
import taskRouter from './tasks/tasks.routes';

app.use('/auth', authRouter);
app.use('/tasks', taskRouter);

// Routes will be added here

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
