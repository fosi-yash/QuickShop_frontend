import React from 'react'
import loader from '../../assets/images/Spinner.gif' 

const Spinner = () => {
  return (
    <div className='text-center'>
      <img src={loader} alt='loader'/>
    </div>
  )
}

export default Spinner
