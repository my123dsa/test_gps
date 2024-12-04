export const getGeocode = async (address) => {
  try {
    // Kakao REST API 호출
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    // 결과가 없는 경우 에러 처리
    if (!data.documents || data.documents.length === 0) {
      throw new Error('주소를 찾을 수 없습니다.');
    }

    // 첫 번째 결과의 좌표 반환
    const { x, y } = data.documents[0];
    return {
      latitude: parseFloat(y),
      longitude: parseFloat(x),
    };
  } catch (error) {
    console.error('주소 변환 중 오류 발생:', error);
    throw error;
  }
  
    // try {
    //   const response = await fetch(
    //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    //   );

    //   if (!response.ok) {
    //     throw new Error(`Geocoding API error: ${response.status}`);
    //   }

    //   const data = await response.json();

    //   if (data.length > 0) {
    //     return {
    //       lat: parseFloat(data[0].lat),
    //       lng: parseFloat(data[0].lon),
    //     };
    //   } else {
    //     throw new Error("해당 주소에 대응되는 위도, 경도 결과를 찾지 못함");
    //   }
    // } catch (error) {
    //   console.error("Geocoding error:", error);
    //   throw error;
    // }
  };