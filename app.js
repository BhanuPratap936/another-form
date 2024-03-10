require('dotenv').config()
const express = require('express')
// const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static(path.resolve(__dirname, "./client/dist")))
const port = process.env.PORT || 5000
app.use(cors())
app.set('trust proxy', 1)

mongoose.connect(process.env.MONGO_URI)

const connection = mongoose.connection
connection.once('open', () => {
    console.log('Mongodb connection has been established')
})

// A schema for the form data
const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    services: String,
    message: String,
}, {timestamps: true})

// A model based on the schema
const FormData = mongoose.model('FormData', FormDataSchema)

app.post('/api/form', async(req, res) => {
    try {
        
const { name, email, phoneNumber, services, message } = req.body;
 
  

  const formData = new FormData({
    name,	
    email, phoneNumber, services, message,
  });

  await formData.save()
  res.status(201).json({formData, message: 'Form data saved successfully'})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
    
})

app.get('/form-data', async(req, res) => {
    try {
        const formData = await FormData.find()
        res.status(200).json(formData)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})
