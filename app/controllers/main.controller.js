const swaggerJSDoc   = require('swagger-jsdoc'); //swagger API doc

module.exports = {

  // redirect to web
  base: (req, res) => {
    res.redirect('/web');
  },

  // show the home page
  showHome: (req, res) => {
    res.render('pages/home');
  },

  // show the documentation
  showDocumentation: (req, res) => {
    res.render('pages/documentation');
  },

  // swagger specification
  swagger: (req, res) => {

    // swagger definition
    var swaggerDefinition = {
      swagger: "2.0",
      info: {
        title: 'Test accounts API',
        version: '1.1.0',
        description: 'Swagger description of REST API for managing test accounts. If token validation is activated you will have to provide "Bearer <token>" in authorization dialog because swagger 2.0 does not natively support bearer tokens',
        contact: {
          email: 'getintouchwithjonas@gmail.com'
        },
        license: 'MIT',
      },
      basePath: '/',

    };
    var options = {
      // import swaggerDefinitions
      swaggerDefinition: swaggerDefinition,
      // path to the API docs
      apis: ['./app/routes.js'],
    };
    var swaggerSpec = swaggerJSDoc(options);
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  }
};
