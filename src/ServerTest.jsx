import { useState } from 'react';
import axios from 'axios';

const ServerTest = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: ''
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post('http://localhost:8000/form', formData, { withCredentials: true });
         window.location.href = response.data.url; // Redirect to the DocuSign signing ceremony
      } catch (error) {
         console.error('Error submitting form', error);
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
         <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
         <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" required />
         <button type="submit">Submit</button>
      </form>
   );
};

export default ServerTest;
