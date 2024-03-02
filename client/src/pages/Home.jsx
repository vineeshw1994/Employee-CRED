import { useDispatch, useSelector } from 'react-redux';

export default function Home() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser)
  return (
    <div className='flex'>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome -<span className='text-blue-500 text-3xl lg:text-6xl'>{currentUser.username}</span></h1>
      </div> 

    </div>
  );
}
