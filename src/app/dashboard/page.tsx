// src/app/community/logs/page.tsx

'use client'

import { GetDashboardData } from '@/services/Service'
import { useEffect, useState } from 'react'

type Notice = {
  _id: number
  title: string
  description: string
}

type CommunityLog = {
  bookingsCompleted: number
  bookingPending: number
  parkingOccupied: number
  notices: Notice[]
}

export default function CommunityLogsPage() {
  const [data, setData] = useState<CommunityLog | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response=await GetDashboardData();
      if (response.success) {
        setData(response.data)
      } else {
        console.error('Error fetching data:', response.message)
      }
    }
    fetchData()
  }, [])

  if (!data) return <div className="text-center mt-10">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6 text-white">Community Logs</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 rounded-xl p-4 shadow">
          <h2 className="text-xl font-semibold">Services Completed</h2>
          <p className="text-2xl">{data.bookingsCompleted}</p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-4 shadow">
          <h2 className="text-xl font-semibold">Total Notices</h2>
          <p className="text-2xl">{data.bookingPending}</p>
        </div>

        <div className="bg-blue-100 rounded-xl p-4 shadow">
          <h2 className="text-xl font-semibold">Parking Occupied</h2>
          <p className="text-2xl">{data.parkingOccupied}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">All Notices</h2>
        <ul className="space-y-4">
          {data.notices.map((notice) => (
            <li key={notice._id} className="border rounded-xl p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{notice.title}</h3>
              <p>{notice.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
