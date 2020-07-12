const multer  = require("multer");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});



module.exports = function (app) {
app.use(multer({storage:storageConfig}).single("filedata"));
app.use(multer({dest:"uploads"}).single("filedata"));
app.post("/upload", function (req, res, next) {

    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});
}