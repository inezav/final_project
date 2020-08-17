const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// const cors = require('cors');
// const fileUpload = require('express-fileupload');
const checkLoginData = require('./helpers');

const port = 3001;
const app = express();

// let DATA_JSON = JSON.parse(fs.readFileSync('./response-users.json', 'utf8'))
let TEST_DATA_JSON = JSON.parse(fs.readFileSync('./test.json', 'utf8'))


app.use(bodyParser.json());
// app.use(fileUpload());
// app.use(cors());
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '../my-app/build')));

app.get('/', (req, res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.get('/api/users/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './response-users.json'));
});

//пока просто для теста попробовать
app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ status: "file is not found" })
    }
    const uploadFile = req.files.file;
    console.log('uploadFile', uploadFile)
    uploadFile.mv(`./public/${uploadFile.name}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send({name: uploadFile.name, path: `/public/${uploadFile.name}`});
    });
});

app.post('/api/registration/', (req, res) => {
    let newUser = {id: TEST_DATA_JSON.users.length + 1, ...req.body}; //данные нового пользователя + id
    console.log('NEW_USER', newUser);
    const userWithNewLogin = TEST_DATA_JSON.users.filter(u => u.login === newUser.login);
    //если что-то находится после .filter, значит логин уже занят
    if (userWithNewLogin.length === 0) {
        TEST_DATA_JSON.users.push(newUser);
        TEST_DATA_JSON.totalUsers = TEST_DATA_JSON.users.length;
        fs.writeFileSync('./test.json', JSON.stringify(TEST_DATA_JSON, null, 4));
        res.json({isReg: true, newUser: newUser});
    } else {
        res.json({isReg: false});
    }

})

app.post('/api/login/', (req, res) => {
    const loginData = req.body;
    console.log('loginData', loginData);
    let users = TEST_DATA_JSON.users; //все пользователи
    // let users = DATA_JSON.users; //все пользователи
    let user = checkLoginData(loginData, users);
    // console.log('user after check', user);
    let id = (user.length === 1 && user.map(u => u.id)); //прошедший проверку id пользователя
    console.log(user);
    console.log(id);
    id ? res.json(...user) : res.json(false);
})

app.get('/api/profile/:id', (req, res) => {
    console.log('Request URL:', req.originalUrl);
    console.log('Request ID:', req.params.id);
    const id = +req.params.id;
    const user = TEST_DATA_JSON.users.filter(u => u.id === id);
    console.log(...user);
    res.json(...user);
})

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
