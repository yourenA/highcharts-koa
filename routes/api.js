var router = require('koa-router')();
import multer from 'koa-multer';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname)
    }
});
var upload = multer({ storage: storage });

var  excelCtrl=require( './controllers/export');
var  importCtrl=require( './controllers/import');
router.post('/export',excelCtrl.exportResult );
router.get('/export',excelCtrl.getExportResult );

router.post('/import', upload.single('file'),importCtrl.importExcel);

module.exports = router;
