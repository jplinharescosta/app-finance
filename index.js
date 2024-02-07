import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Listening on post ${process.env.PORT}`);
});
