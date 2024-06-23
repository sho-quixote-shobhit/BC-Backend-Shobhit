const mongoose = require('mongoose');
const Data = require('./models/Data');
const { data } = require('./jsondata');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
    addData();
});

mongoose.connection.on('error', (err) => {
    console.error('Connection failed', err);
});

const addData = async () => {
    try {
        await Data.insertMany(data.map(d => ({
            end_year: d.end_year,
            intensity: d.intensity,
            sector: d.sector,
            topic: d.topic,
            insight: d.insight,
            url: d.url,
            region: d.region,
            start_year: d.start_year,
            impact: d.impact,
            added: d.added,
            published: d.published,
            country: d.country,
            relevance: d.relevance,
            pestle: d.pestle,
            source: d.source,
            title: d.title,
            likelihood: d.likelihood
        })));
        console.log('All data added');
    } catch (err) {
        console.error('Error adding data', err);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};
