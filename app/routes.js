// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  testDataEntriesController = require('./controllers/test.data.entries.controller'),
  apiController    = require('./controllers/api.controller'),
  uploadController = require('./controllers/upload.controller');

// export router
module.exports = router;

/*
define view routes
--------------------------------------------------------
*/

// show search page
router.get('/', mainController.showHome);

// search currently does not work
router.get('/', testDataEntriesController.queryTestDataEntries);

// get active testdataentries
router.get('/testdataentries', testDataEntriesController.queryTestDataEntries);

// create testdata entry
router.get('/testdataentries/create',  testDataEntriesController.showCreate);
router.post('/testdataentries/create', testDataEntriesController.processCreate);

// edit testdata entry
router.get('/testdataentries/:slug/edit', testDataEntriesController.showEdit);
router.post('/testdataentries/:slug',     testDataEntriesController.processEdit);

// delete testdata entry
router.get('/testdataentries/:slug/delete', testDataEntriesController.deleteTestDataEntry);

// show documentation
router.get('/testdataentries/documentation', mainController.showDocumentation);

// show swagger spec
router.get('/swagger.json', mainController.swagger);

// bulk upload to create
router.get('/upload', uploadController.showUpload);
router.post('/upload', uploadController.processUpload);

//csv template download
router.get('/upload/template', uploadController.showUploadTemplate);

/*
define api routes
--------------------------------------------------------
 */
// swagger defintions
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
 *         description: optional query parameter specifies how much results should be returned default limit is 20
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
 */
router.get('/api/v1/testdataentries', apiController.getTestDataEntries);

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
 *
 */
router.post('/api/v1/testdataentries', apiController.postTestDataEntry);

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
 */
router.delete('/api/v1/testdataentries/:slug', apiController.deleteTestDataEntry);
