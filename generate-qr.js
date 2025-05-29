// generate-qr.js
const QRCode = require('qrcode')

const url = 'https://b8d8-2a01-cb09-e062-e166-9410-239e-4ef5-cc7.ngrok-free.app' 

QRCode.toFile('public/qr.png', url, {
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, function (err) {
  if (err) throw err
  console.log('✅ QR code généré : ./public/qr-code/qr.png')
})
