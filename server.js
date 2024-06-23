const express = require('express');
const app = express();


const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();
const morgan = require('morgan')
app.use(morgan('dev'))



app.use(cors({origin : "https://bc-frontend-shobhit.vercel.app/" , credentials : "true"}))
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

app.get('/' , async(req,res) => {
    res.send('working')
})  

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
