import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import './App.css'

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: "",
    services: '',
    message: '',
  })

  const [formSubmissionData, setFormSubmissionData] = useState([])

  const services = ['Design, Development, and Maintenance of Software & IT', 
  'Project & Service for Customer Care', 
  'Helpdesk', 
  'Consultancy services Covering Research',
'Survey, and Data Analysis',
'Business and Commerce',
'Communication systems',
'Data Management and Analytics',
'Cybersecurity',
'Research and Development',
'System Ingegration',
'Cloud Computing & Migration',
'IT Support',
'Quality Assurance Testing',
'Computer Network Architecture',
'Project Management',
'Digital Marketing',
'Ecommerce Development']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async() => {
    try {
      const response = await axios.get('http://localhost:5000/form-data')
      console.log(response.data)
      setFormSubmissionData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

console.log(formSubmissionData)  

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }


  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      // console.log(formData)
      const response = await axios.post('http://localhost:5000/api/form', formData)
      // console.log('Form Submitted: ', response.data)
      setFormData({
        name: '',
      email: '',
      phoneNumber: "",
      services: '',
      message: '',
      })
      fetchData()
      toast.success('Form submitted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close the notification after 3 seconds
        hideProgressBar: false,
        
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

    } catch (error) {
      console.log('Error submitting form', error)
      toast.error('Error submitting form. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }


  return (
    <div className='main-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h3 style={{textAlign: 'center', margin: '10px 0', fontFamily: "Arial, san-serif", fontWeight: 'bold', fontSize: '24px'}}>Contact Us</h3>
        <div>
          <label>Full Name </label>
          <input type="text" name='name' value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email </label>
          <input type="email" name='email' value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Phone Number </label>
          <input type="text" name='phoneNumber' value={formData.phoneNumber} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Services </label>
          <select name="services" value={formData.state} onChange={handleInputChange} required>
            <option value="">Select Service</option>
            {services.map((service, index) => (
              <option value={service} key={index}>
                  {service}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Message</label>
          <textarea name="message" value={formData.message} onChange={handleInputChange} required></textarea>
        </div>
        
        <button type='submit'>Submit</button>
        
      </form>

      <h3 style={{textAlign: 'center', margin: '30px 0', fontFamily: "Arial, san-serif", fontWeight: 'bold', fontSize: '30px'}}>Dashboard</h3>
      <table>
        
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Services</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {formSubmissionData.map((data) => (
            <tr key={data._id}>
              <td>{data.name}</td>
              <td>{data.email}</td>  
              <td>{data.phoneNumber}</td>
              <td>{data.services}</td>
              <td>{data.message}</td>
              
            </tr>
          ))}
        </tbody>
    </table>
    
    </div>

    
  )
}

export default App