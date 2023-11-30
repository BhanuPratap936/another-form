require('dotenv').config()
const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static(path.resolve(__dirname, "./client/dist")))
const port = process.env.PORT || 5000
app.use(cors())
app.set('trust proxy', 1)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() + 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  };
  

const upload = multer({storage: storage,fileFilter: fileFilter})

// console.log(upload)

mongoose.connect(process.env.MONGO_URI)

const connection = mongoose.connection
connection.once('open', () => {
    console.log('Mongodb connection has been established')
})

// A schema for the form data
const FormDataSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    gender: String,
    hobbies: [String],
    state: String,
    address: String,
    resumePath: String
}, {timestamps: true})

// A model based on the schema
const FormData = mongoose.model('FormData', FormDataSchema)

app.post('/api/form', upload.single('resume'), async(req, res) => {
    try {
        // console.log(req.body)
        // console.log(JSON.parse(req.body.formData))
        // console.log(req.file)
          // Create a new form data instance
            // Extract form data from the request body
//   const { name, dob, gender, hobbies, state, address } = JSON.parse(req.body.formData);
const { name, dob, gender, hobbies, state, address } = req.body;
 const resumePath = req.file.path
console.log(resumePath)
  // Validate the form data
//   if (!name || !dob || !gender || !hobbies || hobbies.length < 2 || !state || !address || !resume) {
//     return res.status(400).json({ error: 'Invalid form data' });
//   }

  const formData = new FormData({
    name,	
    dob,
    gender,
    hobbies,
    state,
    address,
    resumePath,
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

// route to download resume
app.get('/download-resume/:id', async(req, res) => {
    try {
        console.log(req.params)
        const { id } = req.params
        
        const formData = await FormData.findById(id)
        const resumeFilePath = formData.resumePath
        res.download(resumeFilePath)
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// route to info of single data
app.get('/form-data/:id', async(req, res) => {
    try {
        const {id} = req.params
        const singleFormData = await FormData.findById(id)
        res.status(200).json(singleFormData)
    } catch (error) {
        res.status(500).json({error: error.message})
    }

})

// route to update the data
app.put('/form-data/:id', upload.single('resume'), async(req, res) => {
    try {
        const {id} = req.params
        const {name, dob, gender, hobbies, state, address} = req.body
        const updatedData = {
            name,
            dob,
            gender,
            hobbies,
            state,
            address,
        }

        if (req.file) {
            updatedData.resumePath = req.file.path
        }

        const updatedFormData = await FormData.findByIdAndUpdate(id, updatedData, {new: true})
        res.status(200).json(updatedFormData)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// route to delete the data
app.delete('/form-data/:id', async(req, res) => {
    try {
        const {id} = req.params
        await FormData.findByIdAndDelete(id)
        res.status(200).json({message: 'Form data deleted successfully!!'})
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