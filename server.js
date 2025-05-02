import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import cors from 'cors';

dotenv.config()

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json())
app.use(cors({
  origin: 'https://hamsa-ten.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err)
    } else {
      console.log('Connected to MySQL database!')
    }
})

app.post('/api/contact-info', (req, res) => {
    const {
      firstName,
      secondName = null,
      email,
      mobile: mobileNo,
      message = null
    } = req.body
  
    const sql = `INSERT INTO contacts (mobileNo, firstName, secondName, email, message) VALUES (?, ?, ?, ?, ?)`
  
    db.query(sql, [mobileNo, firstName, secondName, email, message], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err)
        return res.status(500).json({ message: 'Database insert failed' })
      }
      res.status(200).json({ message: 'Contact saved successfully', insertId: result.insertId })
    })
  })

  app.listen(port, '0.0.0.0', () => {
    console.log(`The server is listening on port ${port}`)
})
