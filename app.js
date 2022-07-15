require('dotenv').config();

const express = require('express');
const connectDB = require('./DB/connection');
const app = express();
var cors = require('cors');
const path = require('path');

const port = process.env.PORT;
const indexRouter = require('./modules/index.router');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send(`<h1>Welcome</h1>`));
app.use('/api/uploads', express.static(path.join(__dirname, './uploads')));
app.use('/api/auth', indexRouter.authRouter);
app.use('/api/user', indexRouter.userRouter);
app.use('/api/product', indexRouter.productRouter);
app.use('/api/admin', indexRouter.adminRouter);

connectDB();
app.listen(port, () => console.log(`Listening on port ${port}!`));