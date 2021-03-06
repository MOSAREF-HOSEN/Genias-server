    const express = require('express');
    const cors = require('cors');
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    require('dotenv').config()
    const app = express();
    const port = process.env.PORT || 5000;

    //middlewar
    app.use(cors())
    app.use(express.json());




    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e7veb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    async function run (){
        try{
             await client.connect();
             const productCollection = client.db('carExpress').collection('product');
             app.get('/product', async (req, res) =>{
                const query = {};
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products)
             })

             app.get('/product/:id', async(req, res) =>{
                 const id = req.params.id
                 const query = {_id: ObjectId(id)}
                //  console.log(query);
                 const product = await productCollection.findOne(query)
                
                 res.send(product)
             })

             //post
             app.post('/product',async(req,res)=>{
                const newService = req.body;
                const result = await productCollection.insertOne(newService)
                res.send(result)
             })


             //delete
             app.delete('/product/:id', async(req,res)=>{
                const id = req.params.id
                const query = {_id: ObjectId(id)}
                const result = await productCollection.deleteOne(query)
                res.send(result)
             })

        }
        finally{

        }
    }

    run().catch(console.dir)



    app.get('/', (req, res) =>{
        res.send('server running')
    })
    app.listen(port, ()=>{
        console.log("server running",port);
    })


