import { Button } from '@mui/material'
import React from 'react'

export default function Page() {
  return (
    <div>
        <div className='flex justify-center items-center'>
          <Button href='/dashboard/admin/user/new'>
            New User
          </Button>


        </div>
    </div>
  )
}
