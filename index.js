const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//  MongoDB Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6hyeg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const customersCollection = client.db("Goods").collection("customers");
    //  get all customers data from database
    app.get('/customers', async (req, res) => {
      const query = {};
      const customers = await customersCollection.find(query).toArray();
      res.send(customers);
    })
    app.get('/customers/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const customers = await customersCollection.findOne(query);
      res.send(customers);
    })
    //  Store customers data
    app.post('/customers', async (req, res) => {
      const customer = req.body;
      const result = await customersCollection.insertOne(customer);
      res.send(result);
    })
    // Delete customer from database
    app.delete('/customers/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await customersCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })
    // Update or Edit customer data
    app.put('/customers/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const edited = req.body;
      const option = { upsert: true };
      const updatedDoc = {
        $set: {
          displayName: edited.displayName,
          email: edited.email
        }
      }
      const result = await customersCollection.updateOne(query, updatedDoc, option)
      res.send(result);
    })
  }
  finally {
  }
}
run().catch(console.log())

app.get('/', (req, res) => {
  res.send("Fresh food server successfully running")
})

app.listen(port, () => {
  console.log("Server running on", port);
})