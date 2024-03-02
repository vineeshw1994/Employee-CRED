import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CreateAddress() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city || !formData.state || !formData.mobile) {
      return toast.error('Please fill out all fields.');
    }
    if(formData.mobile.length < 10){
      return toast.error('mobile no mustbe ten numbers.');
    }

    try {
      setLoading(true);
      const res = await fetch('/api/user/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
         toast.error(data.message)
        setLoading(false)
      }
      
    
      if(res.ok) {
        navigate('/dashboard');
        toast.success('Adderss created successfully');
      }
    } catch (error) {
      toast.error('Something went wrong.');
      setLoading(false);
    }
  };
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Adderss    </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your city' />
              <TextInput
                type='text'
                placeholder='City'
                id='city'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your State' />
              <TextInput
                type='text'
                placeholder='State'
                id='state'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Mobile' />
              <TextInput
                type='number'
                placeholder='Mobile No'
                id='mobile'
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
                'Submit'
              )}
            </Button>
          </form>
    </div>
  );
}




