const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dataFile = path.join(__dirname, 'data.json');
let data = {};

if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  res.render('index', { data });
});

app.get('/admin', (req, res) => {
  res.render('admin', { data });
});

app.post('/admin/profile', upload.single('avatar'), (req, res) => {
  if (req.body.name) data.name = req.body.name;
  if (req.body.summary) data.summary = req.body.summary;
  if (req.file) data.avatar = '/uploads/' + req.file.filename;
  saveData();
  res.redirect('/admin');
});

app.post('/admin/contact', (req, res) => {
  if (!data.contact) data.contact = {};
  if (req.body.phone) data.contact.phone = req.body.phone;
  if (req.body.email) data.contact.email = req.body.email;
  saveData();
  res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
