'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { nextClient } from '@/lib/nextClient';

export default function AttendancePage() {
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const storeId = params.storeid; 
    const email = params.email;

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'))
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    reject(error)
                },{ enableHighAccuracy: true, // 고정밀도 끄기 
                    maximumAge: 30000, // 30초 이내 캐시된 위치 허용 
                    timeout: 3000 // 3초 제한 
                    }

            )
        })
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault()
 
        try {
            setLoading(true)
            
            const location = await getCurrentLocation()
            console.log('Current location:', location)
            console.log(endpoint)

            const   latitude= location.lat;
            const longitude= location.lng;
            const endpoint = type === 'go' ? 'go-to-work' : 'leave-work'

            const serverResponse = await nextClient.post('/attendance/employee/commute', {
                latitude,
                longitude,
                endpoint,
                storeId,
                email
            });

            alert(serverResponse.data.message);
            
        } catch (error) {
            console.log(error);
            alert(`위도 경도: ${latitude} ${longitude}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'go')}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600"
                    >
                        {loading ? 'Processing...' : '출근하기'}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'leave')}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 hover:bg-red-600"
                    >
                        {loading ? 'Processing...' : '퇴근하기'}
                    </button>
                </div>
            </form>
        </div>
    )
}