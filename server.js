const express = require('express');
const app = express();


const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const morgan = require('morgan')
app.use(morgan('dev'))


const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());


//database
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('connected', () => {
    console.log('connected to database')
})
mongoose.connection.on('error', () => {
    console.log('connection failed')
})


// Routes
const dataRoutes = require('./routes/dataRoutes');
app.use('/api', dataRoutes);
const authRoutes = require('./routes/userRoutes')
app.use('/auth', authRoutes)

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
