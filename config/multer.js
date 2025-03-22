// const multer = require('multer');
// const path = require("path");
// const crypto = require('crypto');

// const fs = require('fs');

// // Define upload directory
// const uploadDir = path.join(__dirname, '../public/images/uploads');

// // Ensure the directory exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// //disk storage setup:
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/public/images/uploads')
//     },
//     filename: function (req, file, cb) {
//       crypto.randomBytes(12, (err,bytes)=>{
//         const fn = bytes.toString("hex") + path.extname(file.originalname);
//         cb(null, fn);
//       });
      
//     }
// })
  
// const upload = multer({ storage: storage })

// //export upload variable:
// module.exports = upload;


const multer = require('multer');
const path = require("path");
const crypto = require('crypto');
const fs = require('fs');

// Define upload directory
const uploadDir = path.join(__dirname, '../public/images/uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage setup:
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use correct directory path
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            if (err) return cb(err);
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage: storage });

// Export upload variable:
module.exports = upload;

