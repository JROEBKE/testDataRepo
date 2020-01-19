const { validationResult } = require('express-validator');
var TestDataEntry = require('../models/testDataEntry');

module.exports = {
  getTestDataEntries: getTestDataEntries,
  postTestDataEntry: postTestDataEntry,
  getTestDataEntry: getTestDataEntry,
  putTestDataEntry: putTestDataEntry,
  patchTestDataEntry: patchTestDataEntry,
  deleteTestDataEntry: deleteTestDataEntry
}

/**
 * Get all test data entries and query, sorting and filtering supported
 */
function getTestDataEntries(req, res) {
      console.log(req);

      // validation error handling
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        console.log(errors);
      }

      // variable definition for pagination, parsing necessary otherwise error
      var resultsPage = (parseInt(req.query.page)) || 1;
      var resultsPerPage = (parseInt());

      // parameter per_page is overriding if limit is used it is also used, parsing necessary otherwise error
      if (req.query.per_page) {
      var resultsPerPage = (parseInt(req.query.per_page));
      }
      else {
      var resultsPerPage = (parseInt(req.query.limit)) || (parseInt(20));
      }


      // sorting ascendencing default
      var resultsSortbyUpdate = req.query.sort || 'asc'; // must be defined to hand it over
      if (req.query.sort !== 'asc') {
        var resultsSortbyUpdate = -1;
      }
      else {
        var resultsSortbyUpdate = 1;
      }

      delete req.query.per_page;
      delete req.query.limit;
      delete req.query.sort;
      delete req.query.page;
      var query = req.query;

      // fuzzy search on text index
      var q = req.query.q || '';
      var regexQ = new RegExp(escapeRegex(q), 'gi');
      //console.log(regexQ);

      // fuzzy search for email
      var email = req.query.email || '';
      var regexEmail = new RegExp(escapeRegex(email), 'gi');


      // fuzzy search for description
      var description = req.query.description || '';
      var regexDescription = new RegExp(escapeRegex(description), 'gi');


      // fuzzy search for stages
      var stage = req.query.stage || '';
      var regexStage = new RegExp(escapeRegex(stage), 'gi');


      // fuzzy search for tags
      var tag = req.query.tag || '';
      var regexTag = new RegExp(escapeRegex(tag), 'gi');

      // if fuzzy search then no alternative search via parameters
      if (q) {

        TestDataEntry.find(
           {$text: { $search: q}},
           { score : { $meta: "textScore" } }
         )
         .sort({ score : { $meta : 'textScore' } })
         .limit(20)
         .exec(function(err, testDataEntries) {
            TestDataEntry.count().exec(function(err, count) {
                       if (err) return next(err)
                       res.json(testDataEntries);
            });
        });
      }

      else {

      TestDataEntry.paginate({email:regexEmail, description:regexDescription, stages:regexStage, tags:regexTag},{sort: {updatedAt: resultsSortbyUpdate},page: resultsPage, limit: resultsPerPage }, function (err, testDataEntries) {
        if (err) {
          res.status(404);
          res.send('Testdata not found!');
        }
        res.json(testDataEntries);
      });
    }
}

/**
 * Post new testDataEntry (outdated default is false)
 */
function postTestDataEntry(req, res) {

    // validation error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
      console.log(errors);
    }

   var testDataEntry = new TestDataEntry({
         email: req.body.email,
         description: req.body.description,
         password: req.body.password,
         stages: req.body.stages,
         tags: req.body.tags,


    });
    // save the testDataEntry
    testDataEntry.save(function(err) {
      if (err) {
              res.send (err);
              console.log(err);
      } else {
        res.status(201);
        res.json({message: 'TestDataEntry created!'});
        //res.json(testDataEntry);
      }
    });

}

/**
 * Get single testDataEntry
 */
function getTestDataEntry(req, res) {

  // validation error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
      console.log(errors);
  }

  //find faster then findOne if limit can be added it might even faster
  TestDataEntry.find({ slug: req.params.slug }, (err, testDataEntry) => {
    if (err) {
      res.status(404);
      res.send('Testdata not found!');
    }
    else {
      res.json(testDataEntry);
    }
  });
}

/**
* Modify single testDataEntry full update
*/
function putTestDataEntry(req, res) {

  // validation error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
      console.log(errors);
  }

  else {

    TestDataEntry.findOne({ slug: req.params.slug }, (err, testDataEntry) => {
      testDataEntry.description = req.body.description;
      testDataEntry.email       = req.body.email;
      testDataEntry.password    = req.body.password;
      testDataEntry.stages      = req.body.stages;
      testDataEntry.tags        = req.body.tags;

      testDataEntry.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'TestDataEntry full updated!' });
      });
    });
  };
}

/**
* Modify single testDataEntry patch update
*/
function patchTestDataEntry(req, res) {

  // validation error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
      console.log(errors);
  }

  else {
    TestDataEntry.findOne({ slug: req.params.slug }, (err, testDataEntry) => {
      // every field is as default previous field only
      testDataEntry.description = req.body.description || testDataEntry.description;
      testDataEntry.email       = req.body.email || testDataEntry.email;
      testDataEntry.password    = req.body.password || testDataEntry.password;
      testDataEntry.stages      = req.body.stages || testDataEntry.stages;
      testDataEntry.tags        = req.body.tags || testDataEntry.tags;

      testDataEntry.save(function(err) {
        if (err)
          res.status(500).end('Something went wrong');
        res.json(testDataEntry);
      });
    });
  };
}

/**
* Delete single testDataEntry
*/
function deleteTestDataEntry(req, res) {

  // validation error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
      console.log(errors);
  }

  TestDataEntry.remove({slug: req.params.slug}, function (err, testDataEntries) {
    if (err)
      res.status(500).end('Something went wrong');
      //res.status(204).end('TestDataEntry deleted'); does not work yet better 200 with message
      res.json({ message: 'TestDataEntry deleted!' });
  });
}

// transform text into regex for search
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
