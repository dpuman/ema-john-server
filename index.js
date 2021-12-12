const express = require('express')
const cors =require('cors');
const bodyPasrer =require('body-parser')
const { MongoClient } = require('mongodb');
const app = express()
const port = 5000

require('dotenv').config()
app.use(cors())
app.use(bodyPasrer.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5w83p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");

  //ADD PRODUCTS
  app.post('/add-products',(req,res)=>{
    const product =req.body;
    // console.log(product)
    products.insertMany(product)
        .then(result=>{
          // console.log(result)
          res.send(result)
        })
  })
  //READ ALL PRODUCT
    app.get('/products',(req,res)=>{
      products.find({})
          .toArray((err,document)=>{
            res.send(document)
          })
    })

  //READ SINGLE PRODUCT

  app.get('/product/:key',(req,res)=>{
    const productKey=req.params.key;
    console.log(productKey);
    products.find({key:productKey})
        .toArray((err,document)=>{
          res.send(document[0])
        })
  })

    //READ MUltyple Products
    app.post('/review-products',(req,res)=>{
        const productKeys=req.body
        console.log(productKeys);
        products.find({key:{$in:productKeys}})
            .toArray((err,document)=>{
                res.send(document)
            })
    })
    //ADD ORDER
     app.post('/add-order',(req,res)=>{
    const order =req.body;
    // console.log(product)
    orderCollection.insertOne(order)
        .then(result=>{
          console.log({result})
          res.send(result.acknowledged)
        })
  })


  console.log('Connection Okya')
});


app.get('/', (req, res) => {
  res.send('Hello Emma watson darling')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})