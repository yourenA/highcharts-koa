var router = require('koa-router')();
var  exportCtrl=require( './controllers/export');
router.post('/export',exportCtrl.exportResult );
router.get('/export',exportCtrl.getExportResult );

module.exports = router;
