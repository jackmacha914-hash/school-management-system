console.log('__dirname at startup:', __dirname);

const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

// Middleware
const requestLogger = require('./middleware/requestLogger');
const corsMiddleware = require('./middleware/cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const gradeRoutes = require('./routes/gradesRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
// const reportCardRoutes = require('./routes/reportCardRoutes'); // Disabled
const clubRoutes = require('./routes/clubs');
const bookRoutes = require('./routes/books');
const eventRoutes = require('./routes/events');
const accountRoutes = require('./routes/accounts');
const statsRoutes = require('./routes/stats');
const schoolUserRoutes = require('./routes/schoolUserRoutes');
const backupsRoutes = require('./routes/backups');
const feesRoutes = require('./routes/fees');
const libraryRoutes = require('./routes/library');
const roleRoutes = require('./routes/roles');
const quizRoutes = require('./routes/quizRoutes');
const classRoutes = require('./routes/class');
const marksRoutes = require('./routes/marksRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize app
const app = express();

// Middleware
app.use(requestLogger);
app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file setup
const uploadsDir = path.join(__dirname, 'uploads');
const profilePhotosDir = path.join(uploadsDir, 'profile-photos');
const reportCardsDir = path.join(__dirname, '..', 'frontend', 'public', 'uploads', 'report-cards');

[uploadsDir, profilePhotosDir, reportCardsDir].forEach(dir => {
  if (!require('fs').existsSync(dir)) require('fs').mkdirSync(dir, { recursive: true });
});

const staticOptions = {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path.extname(filePath))) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
};

app.use('/uploads/profile-photos', express.static(profilePhotosDir, staticOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOptions));
app.use('/uploads/assignments', express.static(path.join(__dirname, 'uploads/assignments'), staticOptions));
app.use('/uploads/homeworks', express.static(path.join(__dirname, 'uploads/homeworks'), staticOptions));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use(express.static(path.join(__dirname, '../frontend/pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resources', resourceRoutes);
// app.use('/api/report-cards', reportCardRoutes); // Disabled
app.use('/api/clubs', clubRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/users', [schoolUserRoutes, userRoutes]);
app.use('/api/homeworks', homeworkRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/assignments', assignmentRoutes);

module.exports = app;
