import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {ToastContainer, toast} from 'react-toastify'

const EditForm = ({formDataId, fetchData, onClose}) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: "",
    hobbies: [],
    state: '',
    address: '',
    resume: null
  })
  const states = ['Delhi', 'Haryana', 'Bihar', 'Odisaa', 'Uttar Pardesh']
  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        
        const response = await axios(`/form-data/${formDataId}`)
        // console.log(response.data)
        const newDob = response.data.dob
        setFormData({...response.data, dob: newDob.slice(0,10)})
      } catch (error) {
        console.log(error)
      }
    }
    fetchSingleData()
  }, [formDataId])

  // console.log(formData)

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
      const response = await axios.put(`/form-data/${formDataId}`, formData, {
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
      onClose()
      toast.success('Form updated successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, // Close the notification after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
    <div className='modal'>
      <form onSubmit={handleSubmit} style={{backgroundColor: '#FACA15', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
      <h3 style={{textAlign: 'center', margin: '10px 0', fontFamily: "Arial, san-serif", fontWeight: 'bold', fontSize: '24px'}}>Update Form</h3>
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
          <input type="radio" name='gender' value='male' checked={formData.gender === 'male'} onChange={handleInputChange} />
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
          <input type="file" accept='.docx' name='resume' onChange={handleFileChange} required/>
        </div>
        <button type='submit'>Save</button>
        <button type='button' className='button-delete' onClick={() => onClose()}>Exit</button>
      </form>
    </div>
  )
}

export default EditForm