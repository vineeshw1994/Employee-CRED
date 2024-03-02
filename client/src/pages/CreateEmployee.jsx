import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CreateEmployee() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      return toast.error('Please fill out all fields.');
    }
    if(formData.password.length < 6){
      return toast.error('Password must be at least 6 characters long.');
    }
    try {
      setLoading(true);
      const res = await fetch('/api/user/createEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
         toast.error('user already exist')
        setLoading(false)
      }
      
    
      if(res.ok) {
        navigate('/dashboard');
        toast.success('Employee Created Successfully');
      }
    } catch (error) {
      toast.error('Something went wrong.');
      setLoading(false);
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Employee</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Employee Role' />
              <TextInput
                type='text'
                placeholder='Role of Employee'
                id='role'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Create Employee'
              )}
            </Button>
          </form>
    </div>
  );
}




