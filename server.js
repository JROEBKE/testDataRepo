// load environment variables
require('dotenv').config();

// grab our dependencies
const express    = require('express');
const app            = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose       = require('mongoose');
const bodyParser     = require('body-parser');
const session        = require('express-session');
const cookieParser   = require('cookie-parser');
const flash          = require('connect-flash'); //error UI
const argv           = require('minimist')(process.argv.slice(2));
const helmet         = require('helmet'); //security validator
const fileUpload     = require('express-fileupload');
const basicAuth      = require('express-basic-auth'); // validation for frontend
const jwt            = require('express-jwt'); //validation for backend
const morgan         = require('morgan');
const cors           = require('cors');
const jwksRsa        = require('jwks-rsa');

// activate basicAuth by for frontend
const Password =  process.env.PASSWORD;
const User =  process.env.USER;
const BasicAuth =  process.env.BASICAUTH;

if (BasicAuth=="true"){
  console.log(`basic auth activated`);
  app.use('/web',basicAuth({ authorizer: myAuthorizer, challenge: true }));
  function myAuthorizer(username, password) {
      const userMatches = basicAuth.safeCompare(username, User)
      const passwordMatches = basicAuth.safeCompare(password, Password)
      return userMatches & passwordMatches
  }
}

// activate token validation for REST API
const JwtAudience =  process.env.JWTAUDIENCE;
const JwtIssuer   =  process.env.JWTISSUER;
const JwksUri   =  process.env.JWKSURI;
const Jwt         =  process.env.JWT;

if (Jwt=="true"){
  console.log(`token validation activated`);

  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: JwksUri //endpoint which provides the signing key
    }),

    // Validate the audience and the issuer.
    audience: JwtAudience,
    issuer: JwtIssuer,
    algorithms: ['RS256']
  });

  app.use('/api', checkJwt);
}

// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,    // forces the session to be saved back to the store
  saveUninitialized: false  // dont save unmodified
}));
app.use(flash());

// tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

// set ejs as our templating engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

// connect to database
mongoose.connect(process.env.DB_URI);

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true })); //true changed to false for validation test
app.use(bodyParser.json());

//fileUpload
app.use(fileUpload());

// enabling CORS for all requests
app.use(cors());

//helmet security
app.use(helmet())

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//Set var port = 8080 as default;
var   port = process.env.PORT || 8080;
if(argv.port !== undefined)
    port = argv.port;
else
    console.log('No --port=xxx specified, taking default port ' + port + '.')

//Set var domain = localhost as default;
var domain =  process.env.DOMAIN || 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
  console.log('server running on ' + applicationUrl);

// set the routes =============================
app.use(require('./app/routes'));

// start our server ===========================
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
