const express = require('express');
const router = express.Router();

const {
  register, login, refreshToken, logout, getMe, updateProfile, changePassword,
} = require('../controllers/authController');
const {
  getSavedAlgorithms, saveAlgorithm, getSavedAlgorithm, updateSavedAlgorithm, deleteSavedAlgorithm,
} = require('../controllers/algorithmController');
const {
  getSavedInputs, saveInput, getSavedInput, updateSavedInput, deleteSavedInput,
  getFavorites, addFavorite, removeFavorite, toggleFavoritePin, checkFavorite,
} = require('../controllers/dataController');
const { protect } = require('../middleware/auth');
const {
  validate, registerValidators, loginValidators,
  savedAlgorithmValidators, savedInputValidators, favoriteValidators, paginationValidators,
} = require('../middleware/validators');

// ======================== AUTH ROUTES ========================
const authRouter = express.Router();
authRouter.post('/register', registerValidators, validate, register);
authRouter.post('/login', loginValidators, validate, login);
authRouter.post('/refresh', refreshToken);
authRouter.post('/logout', protect, logout);
authRouter.get('/me', protect, getMe);
authRouter.put('/profile', protect, updateProfile);
authRouter.put('/password', protect, changePassword);

// ======================== ALGORITHM ROUTES ========================
const algorithmRouter = express.Router();
algorithmRouter.use(protect);
algorithmRouter.get('/', paginationValidators, validate, getSavedAlgorithms);
algorithmRouter.post('/', savedAlgorithmValidators, validate, saveAlgorithm);
algorithmRouter.get('/:id', getSavedAlgorithm);
algorithmRouter.put('/:id', updateSavedAlgorithm);
algorithmRouter.delete('/:id', deleteSavedAlgorithm);

// ======================== INPUT ROUTES ========================
const inputRouter = express.Router();
inputRouter.use(protect);
inputRouter.get('/', paginationValidators, validate, getSavedInputs);
inputRouter.post('/', savedInputValidators, validate, saveInput);
inputRouter.get('/:id', getSavedInput);
inputRouter.put('/:id', updateSavedInput);
inputRouter.delete('/:id', deleteSavedInput);

// ======================== FAVORITE ROUTES ========================
const favoriteRouter = express.Router();
favoriteRouter.use(protect);
favoriteRouter.get('/', paginationValidators, validate, getFavorites);
favoriteRouter.post('/', favoriteValidators, validate, addFavorite);
favoriteRouter.get('/check/:algorithmId', checkFavorite);
favoriteRouter.delete('/:id', removeFavorite);
favoriteRouter.patch('/:id/pin', toggleFavoritePin);

// Mount all routes
router.use('/auth', authRouter);
router.use('/algorithms', algorithmRouter);
router.use('/inputs', inputRouter);
router.use('/favorites', favoriteRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
