'use client';

import { useEffect, useRef, useState } from "react";
import Script from 'next/script';
import { useRegistration } from "@/contexts/RegistrationContext";

export const KakaoMap = ({latAndLng}) => {
    const {setFormData} =  useRegistration();
    const mapContainer = useRef(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const {lat,lng}= latAndLng;

    const handleKakaoMapRequest = (request) => {
        if (request.url.includes('dapi.kakao.com')) {
            const response = NextResponse.next();
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
            return response;
        }
        return NextResponse.next();
    };


    const initializeMap = () => {
        if (!window.kakao?.maps || !mapContainer.current) return;

        const map = new window.kakao.maps.Map(mapContainer.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3
        });

        const marker = new window.kakao.maps.Marker({
            position: map.getCenter()
        });
        marker.setMap(map);

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
            setCurrentLocation(latlng);
        });
    };

    const handleConfirmLocation = () => {
        if (currentLocation) {

            setFormData(prev => ({
                ...prev,
                latitude: currentLocation.getLat(),
                longitude: currentLocation.getLng()
            }))
        } else {
            alert('위치를 먼저 선택해주세요');
        }
    };

    useEffect(() => {
        // 미들웨어 설정
        if (typeof window !== 'undefined') {
            window.addEventListener('fetch', (event) => {
                if (event.request.url.includes('dapi.kakao.com')) {
                    event.respondWith(handleKakaoMapRequest(event.request));
                }
            });
        }
        
        window.kakao?.maps?.load(initializeMap);
        
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('fetch', handleKakaoMapRequest);
            }
        };
    }, [lat, lng]);

    return (
        <>
            <Script
               strategy="beforeInteractive"
               src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
               onLoad={() => {
                   window.kakao?.maps?.load(() => {
                       initializeMap();
                   });
               }}
           />
            <div>
                <div ref={mapContainer} style={{ width: '500px', height: '400px' }} />
                <button onClick={handleConfirmLocation}>위치 확정</button>
            </div>
        </>
    );
};