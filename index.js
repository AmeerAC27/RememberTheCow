/* Authors: Ameer assy , sleman shaaban , eid habib allah */

// השורה הבאה מביאה את מודול ה-Express
const express = require('express');

// השורה הבאה מביאה את מודול ה-path
const path = require('path');

// השורה הבאה מגדירה את אפליקציית Express
const app = express();

// השורה הבאה מגדירה את הפורט שבו תרוץ האפליקציה
const port = 3000;

// השורה הבאה מגדירה מסלול עבור הדף הראשי ('/') באפליקציה
app.get('/', (req, res) => {
  // השורה הבאה שולחת את קובץ ה-HTML שנמצא באותו התיקייה כמו הקובץ הנוכחי
  res.sendFile(path.join(__dirname, '/index.html'));
});

// השורה הבאה מאזינה לפורט המוגדר ומדפיסה הודעה לטרמינל כאשר האפליקציה מתחילה להאזין
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
