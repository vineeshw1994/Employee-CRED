import Webcam from "react-webcam";
import { useCallback,useState, useRef, useEffect} from "react";
import toast from "react-hot-toast";
import { useSelector,useDispatch } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
   
  } from '../redux/user/userSlice.js';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate } from "react-router-dom";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [imgSrc, setImgSrc] = useState(null);
  const [imageName, setImageName] = useState({profilePicture:''});


  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  
  const  dataURItoBlob =(dataURI) =>{
    // Convert base64/URLEncoded data component to raw binary data
    const byteString = atob(dataURI.split(',')[1]);
    // Separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // Write the bytes of the string to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    // Create a Blob from the ArrayBuffer and mime type
    return new Blob([arrayBuffer], { type: mimeString });
  }


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    const blob = dataURItoBlob(imageSrc);

    
        setImageFile(blob);
        if (blob.size > 2 * 1024 * 1024) {
            toast.error('Image size exceeds 2MB. Please capture a smaller image.');
            setImgSrc(null); // Clear the image source
            return;
            }
            
}, [webcamRef]);

  
  const retake = () => {
    setImgSrc(null);
  };

  
  const generateFileName = () => {
    return `webcam_${Date.now()}.png`; 
  };


  const uploadImage = async () => {
   
    
    dispatch(signInStart());
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

       toast.success('Upload is ' + progress + '% done');
      },
      (error) => {
       
        toast.error('Could not upload image (File must be less than 2MB,)');
        setImageFileUrl(null);
        dispatch(signInFailure(error))
      },
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageName({profilePicture:downloadURL});
        });
      }
    );
  };
const uploadImgServer = async(e) => {
    e.preventDefault();
    const userId = currentUser._id;
    console.log(imageName,'this is image name')
    const res = await fetch(`/api/user/uploadImage/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {image:imageName.profilePicture} ),
    });
    const data = await res.json();
     console.log(data,'this is the data from the server')
    if(res.ok){
        toast.success('Image uploaded successfully');
        dispatch(signInSuccess(data))
        navigate('/')
        
    }
}
  
  return (
    
       <div className="container ">
      {imgSrc ? (
        <div className="text-center">
          <img src={imgSrc} alt="webcam"  className="m-auto my-3 h-600 w-600 rounded"/>
          <button onClick={uploadImgServer} className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white py-2 px-2 mb-2" >Submit</button>
        </div>
      ) : (
        <Webcam className="h-400 w-500 m-auto my-3 rounded" ref={webcamRef}  />
      )}
      <div className="btn-container text-center">
        {imgSrc ? (
          <button onClick={retake} className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white py-2 px-2 mb-2">Retake photo</button>
        ) : (
          <button  onClick={capture} className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white py-2 px-2 mb-2">Capture photo</button>
        )}
      </div>

     
    </div>
      
    

    
  );
};

export default CustomWebcam;