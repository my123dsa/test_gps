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
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    // 여기서 alert를 실행하면 위치 정보를 받은 후에 실행됩니다
                    alert(`위도 경도: ${lat} ${lng}`);
                    resolve({
                        lat: lat,
                        lng: lng
                    })
                },
                (error) => {
                    reject(error)
                },
                { 
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 3000 
                }
            )
        })
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault()

        getCurrentLocation()
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