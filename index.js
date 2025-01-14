
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = 5000

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bls3tyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();
        const database = client.db("coffeDB");
        const coffeStoreCollection = database.collection("coffeStore");
        const userCollection = database.collection("User");
        app.post('/addcoffe', async (req, res) => {
            const coffe = req.body
            const result = await coffeStoreCollection.insertOne(coffe);
            res.send(result)
        })
        app.get('/addcoffe', async (req, res) => {
            const cursor = coffeStoreCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/addcoffe/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await coffeStoreCollection.findOne(query);
            res.send(result)
        })

        app.put('/addcoffe/:id', async (req, res) => {
            const id = req.params.id;
            const coffe = req.body;
            console.log(id, coffe);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffe = {
                $set: {
                    name: coffe.name,
                    taste: coffe.taste,
                    chef: coffe.chef,
                    details: coffe.details,
                    photo: coffe.photo,
                    category: coffe.category,
                    supplier: coffe.supplier
                },
            };

            const result = await coffeStoreCollection.updateOne(filter, updateCoffe, options);
            res.send(result)
        })

        app.delete('/addcoffe/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await coffeStoreCollection.deleteOne(query);
            res.send(result)
        })
        // user api

        app.post('/user', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);
            res.send(result)

        })

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        app.patch('/user', async (req, res) => {
            const user = req.body
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    lastSignInTime: user.lastSignInTime
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
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


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})