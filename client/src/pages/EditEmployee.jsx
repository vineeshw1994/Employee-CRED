import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

import "react-circular-progressbar/dist/styles.css";

import toast from "react-hot-toast";
const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [empData, setEmpData] = useState([]);
  console.log(empData)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() =>{
   try{
    const getEmployee = async () => {
        const res = await fetch(`/api/user/${id}`)
        const empData = await res.json()
        if(res.ok){
          setEmpData(empData)
        }
       
    }
    getEmployee()
   }catch(err){
    console.log(err.message)
    toast.error(err.message)
   }
  },[])
  const loading = false

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      toast.error("No changes made");
      return;
    }

    try {
      const res = await fetch(`/api/user/empupdate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success("User's profile updated successfully");
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl bg-indigo-500 rounded-md  py-2 text-white">

        Edit-Employee
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={empData.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={empData.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="role"
          placeholder="Role"
          defaultValue={empData.isPerson}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

       
      </form>
     
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
     
     
    </div>
  );
};

export default EditEmployee;
