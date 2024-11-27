const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// medileware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB_NAME}:${process.env.USER_DB_PASS}@cluster0.fx40ttv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeesCollection = client.db("coffeesDB").collection("coffees-Collection");
        app.get('/', async (req, res) => {
            res.send('hello..')
        })
        app.post('/coffees', async (req, res) => {
            const body = req.body;
            const result = await coffeesCollection.insertOne(body);
            res.send(result)
        })
        app.get('/coffees', async (req, res) => {
            const result = await coffeesCollection.find().toArray()
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const body = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateCoffee = {
                $set: {
                    name: body.name,
                    chef: body.chef,
                    price: body.price,
                    taste: body.taste,
                    category: body.category,
                    details: body.category,
                    photo: body.photo
                },
            };
            const result = await coffeesCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await coffeesCollection.deleteOne(filter);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`server running this port : ${port}`);
})