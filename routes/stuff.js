const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const stuffController = require('../controllers/stuffControllers');

router.post('/', auth, multer, stuffController.createThing );
router.get('/:id', auth, stuffController.getOne);
router.put('/:id', auth, stuffController.modifyOne);
router.delete('/:id', auth, stuffController.deleteOne);
router.get('/', auth, stuffController.getAll );

module.exports = router;