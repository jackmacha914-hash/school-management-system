const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, 'frontend');
const PROD_URL = 'https://school-management-system-av07.onrender.com';
const FILES_TO_UPDATE = [
    'pages/teacher.html',
    'pages/index.html',
    'js/script.js',
    'js/accountant-fees.js',
    'js/student-management.new.js',
    'js/attendance.js',
    'js/teacher-dashboard.js',
    'js/accountant-new.js',
    'js/dashboard-analytics.js',
    'js/events.js',
    'js/library.js',
    'js/roles.js'
];

function updateFile(filePath) {
    try {
        const fullPath = path.join(FRONTEND_DIR, filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;

        // Replace all occurrences of localhost:5000 with production URL
        content = content.replace(
            /http:\/\/localhost:5000\/api/g, 
            `${PROD_URL}/api`
        );

        // Replace any remaining hardcoded localhost URLs
        content = content.replace(
            /http:\/\/localhost:\d+\/api/g, 
            `${PROD_URL}/api`
        );

        // Update any remaining API endpoints
        content = content.replace(
            /'http:\/\/localhost:\d+\/api'/g, 
            `'${PROD_URL}/api'`
        );

        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
        } else {
            console.log(`ℹ️ No changes needed: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

console.log('🚀 Updating API URLs in frontend files...\n');
FILES_TO_UPDATE.forEach(updateFile);
console.log('\n✅ Update complete!');
