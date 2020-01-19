// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  testDataEntriesController = require('./controllers/test.data.entries.controller'),
  apiController    = require('./controllers/api.controller'),
  uploadController = require('./controllers/upload.controller'),
  { check }        = require('express-validator');


const JwtAudience =  process.env.JWTAUDIENCE;
const JwtIssuer=  process.env.JWTISSUER;
const jwt            = require('express-jwt'); //validation for backend
const jwksRsa        = require('jwks-rsa');

// export router
module.exports = router;

/*
define view routes
--------------------------------------------------------
*/

// show search page
router.get('/', mainController.base);
router.get('/web', mainController.showHome);

// search currently does not work
router.get('/web', testDataEntriesController.queryTestDataEntries);

// get active testdataentries
router.get('/web/testdataentries', testDataEntriesController.queryTestDataEntries);

// create testdata entry
router.get('/web/testdataentries/create',  testDataEntriesController.showCreate);
router.post('/web/testdataentries/create',[check('email').trim().escape().isEmail().withMessage('No valid email'),], testDataEntriesController.processCreate);

// edit testdata entry
router.get('/web/testdataentries/:slug/edit', testDataEntriesController.showEdit);
router.post('/web/testdataentries/:slug',[check('email').trim().escape().isEmail().withMessage('No valid email'),], testDataEntriesController.processEdit);

// delete testdata entry
router.get('/web/testdataentries/:slug/delete', testDataEntriesController.deleteTestDataEntry);

// show swagger spec
router.get('/swagger.json', mainController.swagger);

// bulk upload to create
router.get('/web/upload', uploadController.showUpload);
router.post('/web/upload', uploadController.processUpload);

//csv template download
router.get('/web/upload/template', uploadController.showUploadTemplate);

/*
define api routes
--------------------------------------------------------
*/

// swagger defintions
/**
// ABC
/**
* @swagger
* definitions:
*   TestDataEntry:
*     properties:
*       email:
*         type: string
*         description: email of test account used for identication purpose on identity provider
*         required: false
*         example: garfield@email.com
*       description:
*         type: string
*         description: description of test account providing details about account
*         required: false
*         example: Lore ipsum sum
*       password:
*         type: string
*         description: password of test account used for identication purpose on identity provider
*         required: false
*         example: Test123$
*       stages:
*         type: array
*         description: list of stages involved by test account. Please use following convention application_stage with capital letters.
*         required: false
*         example: QS, PRELIVE
*       tags:
*         type: array
*         description: free array . It is recommended to add projects with capital letters and underscore.
*         required: false
*         example: TC123, TC456, TC789
* securityDefinitions:
*  Bearer:
*   type: apiKey
*   name: Authorization
*   in: header
*/

// get all testdataentries
/**
 * @swagger
 * /api/v1/testdataentries:
 *   get:
 *     tags:
 *       - TestDataEntries
 *     description: Returns all test data entries
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: per_page
 *         description: optional query parameter specifies how much results should be returned default limit is 20 and max 100
 *         in: "query"
 *         required: false
 *         type: integer
 *         example: 5
 *       - name: page
 *         description: optional query parameter specifies which page should be returned default page is 1
 *         in: "query"
 *         required: false
 *         type: integer
 *         example: 1
 *       - name: sort
 *         description: optional query parameter specifies to sort by last updated either asc or dsc, default asc
 *         in: "query"
 *         required: false
 *         type: string
 *         example: asc
 *       - name: q
 *         description: optional query parameter which triggers fuzzy search on data fields email, description, stages, tags, if q is specificied other attribute fields are not considered
 *         in: "query"
 *         required: false
 *         type: string
 *         example: TC456
 *       - name: email
 *         description: optional query parameter which triggers fuzzy search on email data field
 *         in: "query"
 *         required: false
 *         type: string
 *         example: garfield
 *       - name: description
 *         description: optional query parameter which triggers fuzzy search on email data field
 *         in: "query"
 *         required: false
 *         type: string
 *         example: lore
 *       - name: stage
 *         description: optional query parameter which triggers fuzzy search on stages array
 *         in: "query"
 *         required: false
 *         type: string
 *         example: QS
 *       - name: tag
 *         description: optional query parameter which triggers fuzzy search on tag array
 *         in: "query"
 *         required: false
 *         type: string
 *         example: TC123
 *     responses:
 *       200:
 *         description: An array of test data entries
 *         schema:
 *          $ref: "#/definitions/TestDataEntry"
 *     security:
 *        - Bearer: []
 */
router.get('/api/v1/testdataentries',[
    check('per_page').trim().escape().optional().isFloat({ min: 0, max: 100 }).withMessage('You have to provide a number between 0 and 100'),
    check('page').trim().escape().optional().isFloat({ min: 0, max: 10000 }).withMessage('You have to provide a number between 0 and 10.000'),
    check('description').trim().escape().optional().isAlphanumeric().isLength({max: 2000}).withMessage('You have to provide a string with less than 2.000 chars'),
    check('stage').trim().escape().optional().isAlphanumeric().isLength({max: 2000}).withMessage('You have to provide a string with less than 2.000 chars'),
    check('tag').trim().escape().optional().isAlphanumeric().isLength({max: 2000}).withMessage('You have to provide a string with less than 2.000 chars'),
], apiController.getTestDataEntries);

// post new testDataEntry
/**
 * @swagger
 * /api/v1/testdataentries:
 *   post:
 *     tags:
 *       - TestDataEntries
 *     description: Post a new test data entry
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: testDataEntry
 *       in: "body"
 *       description: TestDataEntry Object
 *       required: true
 *       schema:
 *           $ref: '#/definitions/TestDataEntry'
 *     responses:
 *       201:
 *         description: TestDataEntry created!
 *     security:
 *        - Bearer: []
 */

router.post('/api/v1/testdataentries',[
], apiController.postTestDataEntry);


// get single testDataEntry
/**
 * @swagger
 * /api/v1/testdataentries/{id}:
 *   get:
 *     tags:
 *       - TestDataEntries
 *     description: Returns a single test data entry
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: email with lower letters and less than 17 characters
 *         in: path
 *         required: true
 *         type: string
 *         example: garfield@email.com
 *     responses:
 *       200:
 *         description: A dedicated test data entry
 *     security:
 *        - Bearer: []
 */
router.get('/api/v1/testdataentries/:slug', apiController.getTestDataEntry);

// modify single testDataEntry full update
/**
 * @swagger
 * /api/v1/testdataentries/{id}:
 *   put:
 *     tags:
 *       - TestDataEntries
 *     description: Updates a single test data entry by full update
 *     produces: application/json
 *     parameters:
 *     - name: id
 *       description: email with lower letters
 *       in: "path"
 *       required: true
 *       type: string
 *       example: garfield@email.com
 *     - name: testDataEntry
 *       in: "body"
 *       description: TestDataEntry Object
 *       required: true
 *       schema:
 *           $ref: '#/definitions/TestDataEntry'
 *     responses:
 *       200:
 *         description: TestDataEntry full updated!
 *     security:
 *        - Bearer: []
 */
router.put('/api/v1/testdataentries/:slug', apiController.putTestDataEntry);

// modify single testDataEntry by patch
/**
 * @swagger
 * /api/v1/testdataentries/{id}:
 *   patch:
 *     tags:
 *       - TestDataEntries
 *     description: Updates a single test data entry by patch
 *     produces: application/json
 *     parameters:
 *     - name: id
 *       description: email with lower letters
 *       in: "path"
 *       required: true
 *       type: string
 *       example: garfield@email.com
 *     - name: testDataEntry
 *       in: "body"
 *       description: TestDataEntry Object
 *       required: false
 *       schema:
 *           $ref: '#/definitions/TestDataEntry'
 *     responses:
 *       200:
 *           $ref: '#/definitions/TestDataEntry'
 *     security:
 *        - Bearer: []
 */
router.patch('/api/v1/testdataentries/:slug', apiController.patchTestDataEntry);

// delete single testDataEntry
/**
 * @swagger
 * /api/v1/testdataentries/{id}:
 *   delete:
 *     tags:
 *       - TestDataEntries
 *     description: Deletes a single testDataEntry
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: email with lower letters
 *         in: path
 *         required: true
 *         type: string
 *         example: garfield@email.com
 *     responses:
 *       200:
 *         description: Successfully deleted
 *     security:
 *        - Bearer: []
 */
router.delete('/api/v1/testdataentries/:slug', apiController.deleteTestDataEntry);
