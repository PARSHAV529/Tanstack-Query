import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingIndicator from '../UI/LoadingIndicator.jsx'
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const param = useParams()

  const {data,isPending,isError,error}= useQuery({
    queryKey:['events', param.id],
    queryFn:fetchEvent
  })

  const {mutate}=useMutation({

    mutationFn:updateEvent,
    onMutate:async (data)=>{
     await queryClient.cancelQueries({queryKey:['events', param.id]});
      const prevdata = queryClient.getQueryData(['events', param.id])
      const newEvent = data.event
       queryClient.setQueryData(['events', param.id],newEvent)

       return {prevdata}
    }

    ,
    onError:(error,data,context)=>{
      queryClient.setQueryData(['events', param.id],context.prevdata)

    }
    ,
    onSettled:()=>{
      queryClient.invalidateQueries(['events', param.id])
    }
   

  })

  function handleSubmit(formData) {

    // const event = Object.fromEntries(formData)
    // console.log(formData)
    mutate({id:param.id,event:formData})
navigate('../')
  }


  let content;
  if(isPending){
    content=<div className='center'> <LoadingIndicator/>  </div> 
  }

  if(isError){
    content=<><ErrorBlock title="faild to load event" message={error.info?.message || ''}/><div className='form-action'><Link className='button' to='../'>Okay</Link></div></>
  }

  if(data){

    content= <EventForm inputData={data} onSubmit={handleSubmit}>
    <Link to="../" className="button-text">
      Cancel
    </Link>
    <button type="submit" className="button">
      Update
    </button>
  </EventForm>

  }


  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
     {content}
    </Modal>
  );
}
