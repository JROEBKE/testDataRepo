module.exports = {

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
        title: 'TestData API',
        version: '1.0.0',
        description: 'Swagger description of REST API for test data management',
        contact: {
          email: 'getintouchwithjonas@gmail.com'
        },
        license: 'MIT',
      },
      //host: 'localhost:8080',
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
