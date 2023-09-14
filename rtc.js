/* Authors: Ameer assy , sleman shaaban , eid habib allah */

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require('path');
const app = express();
const port = 3000;

// הגדרת מנוע התצוגה לשימוש ב-ejs
app.set("view engine", "ejs");

// פונקציה לקריאת נתוני הרשימה מהקובץ list.json
function readToDoListData() {
  try {
    const data = fs.readFileSync("list.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { items: [] };
  }
}

// פונקציה לשמירת נתוני הרשימה לקובץ list.json
function saveToDoListData(data) {
  fs.writeFileSync("list.json", JSON.stringify(data));
}

// השתמש ב-session middleware
app.use(session({
  secret: "your-secret-key", 
  resave: false,
  saveUninitialized: true
}));

// הגדרת מסלול הבית - מציג קובץ HTML בכתובת הבסיס
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// מסלול לרשימת המשימות - מציג דף HTML רק אם יש משתמש מחובר
app.get('/todolist', (req, res) => {
  if ((req.session?.user?.length || 0) > 0) {
    res.sendFile(path.join(__dirname, '/todolist.html'));
  } else {
    res.redirect('/');
  }
});
