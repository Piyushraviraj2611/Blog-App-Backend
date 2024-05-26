const express = require('express');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error');
const cors = require('cors');
const app = express();
require('dotenv').config();

// app.use(cors({ origin: "https://blog-writefreely-adminpanel-or3t.onrender.com" }));
// app.use(cors({ origin: 'http://localhost:3000' }));
app.set('trust proxy', 1);
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.CORS_ORIGIN_LIVE
				: process.env.CORS_ORIGIN_DEV,
		credentials: true,
	})
);
console.log(process.env.NODE_ENV, process.env.CORS_ORIGIN_DEV);

app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.CORS_ORIGIN_LIVE
				: process.env.CORS_ORIGIN_DEV,
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
		credentials: true,
	})
);
app.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requiest-With, Content-Type, Accept'
	);
	if (true) {
		res.header('Access-Control-Allow-Credentials', true);
		res.header(
			'Access-Control-Allow-Origin',
			process.env.NODE_ENV === 'production'
				? process.env.CORS_ORIGIN_LIVE
				: process.env.CORS_ORIGIN_DEV
		);
	}
	res.header(
		'Access-Control-Allow-Methods',
		'GET, PUT, POST, DELETE, HEAD, OPTIONS'
	);
	next();
});
console.log(
	'asdfsdf',
	process.env.CORS_ORIGIN_LIVE,
	process.env.CORS_ORIGIN_DEV
);

app.set('trust proxy', 1);
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route Imports
const postRoutes = require('./routes/postRoutes');

app.get('/', (req, res) => {
	//res.send('<h1>Working Fine. <a href="http://localhost:3000/">Click here</a> to go to frontend.');
	res.send(
		'<h1>Working Fine. <a href="https://blog-writefreely-adminpanel-or3t.onrender.com/">Click here</a> to go to frontend.'
	);
});
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/auth', userRoutes);

// Middleware for Error Handling
app.use(errorMiddleware);

module.exports = app;
