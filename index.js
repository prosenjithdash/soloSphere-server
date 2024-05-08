const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 8000;

//middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    
  ],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kybpity.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
      
      const jobsCollection = client.db("soloPhere").collection("jobs");
      
      const bidsCollection = client.db("soloPhere").collection("bids");
    
        
        
        // Get all jobs data from DB
        // jobs data store in MongoDB Static
        // READ All jobs 
        app.get('/jobs', async (req, res) => {
          const result = await jobsCollection.find().toArray();
          res.send(result)
          
        })


        // Get a single job data from DB (Details page max_use)
        app.get('/job/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            
            // const options = {
        
            //     projection: { job_title: 1, description: 1, min_price: 1, max_price: 1, category: 1, deadline: 1 },
                
            // };

            const result = await jobsCollection.findOne(query);
                                                      //options
            res.send(result)
                
        })



        // CREATE / Save / Post a bid data store in DB
        app.post('/bid', async (req, res) => {
            const bidData = req.body;
            console.log(bidData)
           
        // const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
            //     }
            
            const result = await bidsCollection.insertOne(bidData);          res.send(result)
          
        })


        // CREATE / Save / Post a job data store in DB
        app.post('/job', async (req, res) => {
            const jobData = req.body;
            console.log(jobData)
           
        // const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
            //     }
            
            const result = await jobsCollection.insertOne(jobData);          res.send(result)
          
        })

        // Get all jobs posted by specific user
        app.get('/jobs/:email', async (req, res) => {
          const email = req.params.email;
          const query = {"buyer.email":email}
            const result = await jobsCollection.find(query).toArray();
            res.send(result)
            
        })
      

        // Delete jobs data from server
        app.delete('/job/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
            const result = await jobsCollection.deleteOne(query);
            res.send(result)
            
        })
      
       // Update jobs data from server
        app.put('/job/:id', async (req, res) => {
          const id = req.params.id
          const jobData = req.body
          const query = { _id: new ObjectId(id) }
          const options = { upsert: true }
          const updateDoc = {
            $set: {
              ...jobData,
            },
          }
          const result = await jobsCollection.updateOne(query, updateDoc, options)
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
  res.send('SoloPhere server is running!')
})

app.listen(port, () => {
  console.log(`SoloPhere server is running on port ${port}`)
})