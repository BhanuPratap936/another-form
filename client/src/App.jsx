import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import FileSaver from 'file-saver'
import './App.css'
import EditForm from './EditForm'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: "",
    hobbies: [],
    state: '',
    address: '',
    resume: null
  })

  const [formDataId, setFormDataId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formSubmissionData, setFormSubmissionData] = useState([])
  const fileInputRef = useRef(null)
  const [fileSubmitted, setFileSubmitted] = useState(false)

  const states = ['Delhi', 'Haryana', 'Bihar', 'Odisaa', 'Uttar Pardesh']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async() => {
    try {
      const response = await axios.get('/form-data')
      // console.log(response.data)
      setFormSubmissionData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({...formData, [name]: value})
  }

  const handleCheckBoxChange = (e) => {
    const {value, checked} = e.target
    let updatedHobbies = [...formData.hobbies]
    if (checked) {
      updatedHobbies.push(value)
    } else {
      updatedHobbies = updatedHobbies.filter((hobby) => hobby !== value)
    }

    setFormData({...formData, hobbies: updatedHobbies})
  }

  const handleFileChange = (e) => {
    setFormData({...formData, resume: e.target.files[0]})
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      // console.log(formData)
      const response = await axios.post('/api/form', formData, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
      // console.log('Form Submitted: ', response.data)
      setFormData({
        name: '',
        dob: '',
        gender: "",
        hobbies: [],
        state: '',
        address: '',
        resume: null
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

      setFileSubmitted(true)
      setTimeout(() => {
        setFileSubmitted(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 1000)

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

  const handleCancel = () => {
    setFormData({
      name: '',
      dob: '',
      gender: "",
      hobbies: [],
      state: '',
      address: '',
      resume: null
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = async (id, name) => {
    try {
      const response = await axios(`/download-resume/${id}`, {
        responseType: 'blob'
      })
      // console.log(response)

      const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
      FileSaver.saveAs(blob, `${name}-resume`)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (id) => {
    setFormDataId(id)
    setShowEditModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/form-data/${id}`)
      setFormSubmissionData(formSubmissionData.filter((item) => item._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='main-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h3 style={{textAlign: 'center', margin: '10px 0', fontFamily: "Arial, san-serif", fontWeight: 'bold', fontSize: '24px'}}>Register Form</h3>
        <div>
          <label>Name </label>
          <input type="text" name='name' value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Date Of Birth </label>
          <input type="date" name='dob' value={formData.dob} onChange={handleInputChange} required />
        </div>
        <div style={{marginBottom: '10px'}}>
          <label className='label-block'>Gender </label>
          <label style={{marginRight: '20px'}}>
          <input type="radio" name='gender' value='male' checked={formData.gender === 'male'} onChange={handleInputChange}/>
          Male
          </label>
          <label>
            <input type="radio" name='gender' value='female' checked={formData.gender === 'female'} onChange={handleInputChange} />
            Female
          </label>
        </div>
        <div style={{marginBottom: '10px'}}>
          <label className='label-block' >Hobbies </label>
          <label style={{marginRight: '20px'}}>
            <input type="checkbox" name='hobbies' value='reading' checked={formData.hobbies.includes('reading')} onChange={handleCheckBoxChange} />
            Reading
          </label>
          <label style={{marginRight: '20px'}}>
            <input type="checkbox" name='hobbies' value='sports' checked={formData.hobbies.includes('sports')} onChange={handleCheckBoxChange} />
            Sports
          </label>
          <label>
            <input type="checkbox" name='hobbies' value='music' checked={formData.hobbies.includes('music')} onChange={handleCheckBoxChange} />
            Music
          </label>
        </div>
        <div>
          <label>States </label>
          <select name="state" value={formData.state} onChange={handleInputChange} required>
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option value={state.toLowerCase()} key={index}>
                  {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleInputChange} required></textarea>
        </div>
        <div>
          <label>Upload Resume </label>
          <input type="file" accept='.docx' name='resume' onChange={handleFileChange} ref={fileInputRef} disabled={fileSubmitted} required />
        </div>
        <button type='submit'>Submit</button>
        <button className='button-delete' onClick={() => handleCancel()}>Cancel</button>
      </form>

      <h3 style={{textAlign: 'center', margin: '30px 0', fontFamily: "Arial, san-serif", fontWeight: 'bold', fontSize: '30px'}}>Dashboard</h3>
      <table>
        
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Hobbies</th>
            <th>State</th>
            <th>Address</th>
            <th>Resume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formSubmissionData.map((data) => (
            <tr key={data._id}>
              <td>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</td>
              <td>{data.dob.slice(0,10).split('-').reverse().join('-')
}</td>
              <td>{data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</td>
              <td>{data.hobbies.map((hobby) => (hobby.charAt(0).toUpperCase() + hobby.slice(1))).join(', ')}</td>
              <td>{data.state.charAt(0).toUpperCase() + data.state.slice(1)}</td>
              <td>{data.address}</td>
              <td>
                <button onClick={() => handleDownload(data._id, data.name)} className='table-button'>Download Resume</button>
              </td>
              <td>
                <button style={{marginRight: '10px', backgroundColor: '#1C64F2', color: 'white'}} onClick={() => handleEdit(data._id)}>Update</button>
                <button type='button' className='button-delete' onClick={() => handleDelete(data._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    { showEditModal && <EditForm formDataId={formDataId} fetchData={fetchData} onClose={() => setShowEditModal(false)} />}
    </div>

    
  )
}

export default App