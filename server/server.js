const express = require('express');
const serialport = require('serialport');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CORS 설정
const corsOptions = {
  origin: 'http://localhost:3000', // React 앱의 주소
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const { SerialPort } = serialport;

const portname = 'COM3';
const port = new SerialPort({ 
  path: portname, 
  baudRate: 9600,
});

let latestNFCData = null;
let lastUpdateTime = null;
let isNewData = false;
let previousNFCData = null;

port.on('open', function(){
  console.log('Serial Port OPEN');
});

port.on('data', function(data){
  const newData = data.toString().trim();
  if (newData !== previousNFCData) {
    latestNFCData = newData;
    lastUpdateTime = Date.now();
    isNewData = true;
    previousNFCData = newData;
    console.log("New NFC Data: ", latestNFCData);
    
    // NFC 데이터가 변경되면 모든 연결된 클라이언트에게 알림
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'nfc_update', data: latestNFCData }));
      }
    });
  }
});

app.get('/nfc-data', (req, res) => {
  res.json({ 
    nfcData: latestNFCData, 
    updateTime: lastUpdateTime,
    isNewData: isNewData 
  });
  isNewData = false; // Reset after sending
});

port.on('error', (err) => {
  console.error('SerialPort 오류 발생: ', err.message);
  if (err.message.includes('Access denied')) {
    console.log('COM3 포트에 대한 접근이 거부되었습니다. 다른 프로그램이 사용 중인지 확인하세요.');
  }
});

// WebSocket 연결 처리
wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    // 여기에서 필요한 경우 메시지 처리 로직을 추가할 수 있습니다.
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// 서버 상태 확인을 위한 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});