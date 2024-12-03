import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import nfcIcon from './img/free-icon-nfc-4073545.png';
import qrCode from './img/qr.png'; // 새로 추가된 import
import OpenCCTVButton from './OpenCCTVButton';

// WebSocket 연결
const ws = new WebSocket('ws://localhost:3001');

const NFCTagPage = () => {
  console.log("NFCTagPage rendered");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'nfc_update') {
        console.log("New NFC data detected:", message.data);
        setShowQR(true);
      }
    };

    return () => {
      ws.onmessage = null;
    };
  }, []);

  if (showQR) {
    return (
      <div style={styles.container}>
        <h2 style={styles.qrInstructions}>휴대폰으로 아래 QR에 접속해주세요!</h2>
        <img src={qrCode} alt="QR Code" style={styles.qrCode} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NFC 카드를 태그해주세요</h1>
      <div style={styles.nfcIcon}>
        <img src={nfcIcon} alt="NFC Icon" style={styles.icon} />
      </div>
    </div>
  );
};

const DogInfoPage = () => {
  const [dogName, setDogName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dogName.trim() !== '' && neighborhood.trim() !== '') {
      try {
        // 'dogs' 컬렉션에 데이터 저장
        const dogDocRef = await addDoc(collection(db, "dogs"), {
          name: dogName,
          neighborhood: neighborhood,
          timestamp: new Date(),
          flag: true
        });
        console.log("Document written with ID: ", dogDocRef.id);

        // 'dogs_poin' 컬렉션에 새 문서 추가
        const dogsPoinDocRef = await addDoc(collection(db, "dogs_poin"), {
          center_x: "",
          center_y: "",
          name: dogName,
          pee_x: "",
          pee_y: "",
          poo_x: "",
          poo_y: ""
        });
        console.log("dogs_poin document added with ID: ", dogsPoinDocRef.id);

        setShowButton(true);
      } catch (error) {
        console.error("Error adding documents: ", error);
        alert("데이터 저장 중 오류가 발생했습니다.");
      }
    }
  };


  return (
    <div style={styles.container}>
      {!showButton ? (
        <>
          <h1 style={styles.title}>정보를 입력해주세요</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>강아지 이름을 입력해주세요.</label>
            <input
              type="text"
              value={dogName}
              onChange={(e) => setDogName(e.target.value)}
              style={styles.input}
              placeholder="강아지 이름"
              required
            />
            <label style={styles.label}>사는 동네를 입력해주세요.(OO동)</label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              style={styles.input}
              placeholder="사는 동네"
              required
            />
            <button type="submit" style={styles.button}>제출</button>
          </form>
        </>
      ) : (
        <OpenCCTVButton dogName={dogName} neighborhood={neighborhood} />
      )}
      {!showButton && <Link to="/" style={styles.link}>처음으로 돌아가기</Link>}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NFCTagPage />} />
        <Route path="/dog-info" element={<DogInfoPage />} />
      </Routes>
    </Router>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  qrInstructions: {
    fontSize: '60px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  nfcIcon: {
    marginBottom: '20px',
  },
  icon: {
    width: '120px',
    height: '120px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    marginTop: '20px',
    fontSize: '16px',
    transition: 'color 0.3s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '300px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    alignSelf: 'flex-start',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'border-color 0.3s',
  },
  qrCode: {
    width: '80%',
    maxWidth: '300px',
    height: 'auto',
  },
};

export default App;