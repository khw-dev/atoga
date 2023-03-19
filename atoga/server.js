require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/translate', function (req, res) {
  const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  const request = require('request');

  const { sourceLang, targetLang, text } = req.body;

  const options = {
    url: api_url,
    form: { 'source': sourceLang, 'target': targetLang, 'text': text },
    headers: { 'X-Naver-Client-Id': process.env.PAPAGO_ID, 'X-Naver-Client-Secret': process.env.PAPAGO_SECRET }
  }; //.env 파일에 PAPAGO_ID, PAPAGO_SECRET 항목을 추가해주세요.

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else {
      res.status(response.statusCode).end();
      console.error(response.statusCode);
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
}); //http://localhost:3000 에서 확인하실 수 있습니다.

app.use(express.static(path.join(__dirname, 'react-project/build')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});
