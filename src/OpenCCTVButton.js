import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const OpenCCTVButton = ({ dogName, neighborhood }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRandomDogFact = () => {
    const dogFacts = [
      "개의 코 지문은 사람의 지문처럼 고유합니다.",
      "개는 인간보다 10,000배 더 예민한 후각을 가지고 있습니다.",
      "개를 쓰다듬으면 혈압과 심박수가 낮아질 수 있습니다.",
      "개는 약 1,700개의 미뢰를 가지고 있습니다.",
      "개는 파란색과 노란색을 볼 수 있습니다.",
      "모든 강아지는 귀가 들리지 않은 상태로 태어납니다.",
      "개는 자신의 수염을 감각 장치로 사용합니다.",
      "개는 인간의 암과 혈당 변화를 감지하도록 훈련될 수 있습니다.",
      "강아지는 하루에 18-20시간 정도 잠을 잡니다.",
      "개의 귀에는 인간보다 두 배 많은 근육이 있습니다."
    ];
    return dogFacts[Math.floor(Math.random() * dogFacts.length)];
  };

  const dogFact = useMemo(() => getRandomDogFact(), []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = '7218c955a877a2a3440d98a7e010f689';
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(neighborhood)}&units=metric&lang=kr&appid=${apiKey}`
        );

        const { main, weather } = response.data;
        setWeatherData({
          temperature: main.temp,
          description: weather[0].description,
        });
      } catch (error) {
        console.error('날씨 데이터 요청 실패:', error);
        setError('날씨 정보를 가져오는데 실패했습니다. 나중에 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [neighborhood]);

  const openCCTV = () => {
    window.open('https://apps.apple.com/us/app/findelfl/id1190449125', '_blank');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.dogName}>{dogName}의 산책</h2>
      <h3 style={styles.neighborhood}>{neighborhood}의 날씨</h3>
      {loading ? (
        <p style={styles.loadingText}>날씨 정보를 불러오는 중...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : weatherData ? (
        <div style={styles.weatherContainer}>
          <span style={styles.weatherText}>{weatherData.description}</span>
          <span style={styles.weatherText}>{weatherData.temperature.toFixed(1)}°C</span>
        </div>
      ) : null}
      <button onClick={openCCTV} style={styles.button}>
        CCTV 열기
      </button>
      <div style={styles.dogFactContainer}>
        <h4 style={styles.dogFactTitle}>알고 계셨나요?</h4>
        <p style={styles.dogFactText}>{dogFact}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80vh',
    width: '100%',
    maxWidth: '100%',
    padding: '40px 20px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  dogName: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  neighborhood: {
    fontSize: '24px',
    marginBottom: '30px',
    color: '#555',
    textAlign: 'center',
  },
  weatherContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: '40px',
  },
  weatherText: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  button: {
    padding: '16px 32px',
    fontSize: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '20px', // 버튼 아래에 여백 추가
  },
  error: {
    color: 'red',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '20px',
  },
  dogFactContainer: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
  },
  dogFactTitle: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  dogFactText: {
    fontSize: '18px',
    color: '#555',
    textAlign: 'center',
    lineHeight: '1.4',
  },
};

export default OpenCCTVButton;