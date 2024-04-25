const express = require('express');
const app = express();
const morgan = require('morgan');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const orderRouter = require('./routes/orderRoutes')
const productRouter = require('./routes/productRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
// browsers understand the headers and acta on them
// Development logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(express.json())
// Limit requests from same API
const limiter = rateLimit({   // global middleware
    max: 100000,
    windowMs: 60 * 60 * 1000,   // 100 requests from same ip in 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
    });
    app.use('/api', limiter);
    
    // Body parser, reading data from body into req.body
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({extended: true, limit:'10kb'}));
    app.use(cookieParser());
    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());
    
    // Data sanitization against XSS -> cross side scripting attacks
    app.use(xss());
    
    // Prevent http parameter pollution -> prevents repetition of same field in query
    app.use(
        hpp({
        whitelist: [   // avoid using hpp for the following fields
        // like price=5&price=9 should work
            'price','category','Stock'
        ]
        })
    );
    
    // Serving static files
    app.use(express.static(`${__dirname}/public`));
    
// tourRouter is a middleware and we specify the route to be used for the middleware
// Test middleware
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});
//middlewares for routes

app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/users', userRouter)

app.all('*',(req,res,next) =>{   // handles all http methods and * means all routes for which we have not defined a controller
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(globalErrorHandler);
module.exports = app;
