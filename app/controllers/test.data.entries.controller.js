const { validationResult } = require('express-validator');
var TestDataEntry = require('../models/testDataEntry');

module.exports = {
  queryTestDataEntries: queryTestDataEntries,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteTestDataEntry: deleteTestDataEntry,
  escapeRegex: escapeRegex
}

/**
 * Show all testDataEntries based on query
 */
 function queryTestDataEntries(req, res) {

        // limit set to 5000 to cap load
       var limit = (parseInt(req.query.limit)) || (parseInt(5000));
       var page = (parseInt(req.query.page)) || 1;

       // sorting ascendencing default, ignored if generic search
       var sort = req.query.sort || 'asc'; // must be defined to hand it over
       if (req.query.sort !== 'asc') {
         var sort = -1;
       }
       else {
         var sort = 1;
       }

       // if generic search parameter exists it overwrites specific queries and performs find in text index
       var q = req.query.q || '';
       const regexQ = new RegExp(escapeRegex(q), 'gi');
       console.log(regexQ);
       console.log(limit);
       if (q) {
        TestDataEntry
           .find(
             {$text: { $search: q}},
             { score : { $meta: "textScore" } }
           )
           .skip((limit * page) - limit)
           .sort({email: sort})
           .limit(limit)
           .exec(function(err, testDataEntries) {
             TestDataEntry.count().exec(function(err, count) {
               if (err) return next(err)
               res.render('pages/testDataEntries', {
                 testDataEntries: testDataEntries,
                 current: page,
                 success: req.flash('success'),
                 pages: Math.ceil(count / limit),
               })
             })
           })
        }


       // return all because no query parameter
       else {
         TestDataEntry
          .find({})
          .skip((limit * page) - limit)
          .sort({email: sort})
          .limit(limit)
          .exec(function(err, testDataEntries) {
            TestDataEntry.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('pages/testDataEntries', {
                testDataEntries: testDataEntries,
                current: page,
                success: req.flash('success'),
                pages: Math.ceil(count / limit),
              })
            })
          })
       }

 }

 /**
  * Show the create form
  */
 function showCreate(req, res) {
   res.render('pages/create', {
     errors: req.flash('errors')
   });
 }

/**
* Process the creation form
*/
function processCreate(req, res) {
 // create a new testDataEntry
 const testDataEntry = new TestDataEntry({
   email: req.body.email,
   stages: req.body.stages,
   tags: req.body.tags,
   password: req.body.password,
   description: req.body.description
});

 // if there are errors, redirect and save errors to flash
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   req.flash('errors', errors.map(err => err.msg));
   return res.redirect('/web/testDataEntries/create'+'?email='+testDataEntry.email+'&password='+testDataEntry.password+'&stages='+testDataEntry.stages+'&tags='+testDataEntry.tags+'&description='+testDataEntry.description);
 }

 // save testDataEntry
 testDataEntry.save(function(err) {
   if (err){
     req.flash('errors', 'email already in use!'); // struggle to include dynamic link to existing entry +'<a href=\"/testdataentries/:slug/edit"\>Edit existing one</a>'
     return res.redirect('/web/testDataEntries/create'+'?email='+testDataEntry.email+'&password='+testDataEntry.password+'&stages='+testDataEntry.stages+'&tags='+testDataEntry.tags+'&description='+testDataEntry.description);
   }
   // set a successful flash message
   req.flash('success', 'Successfully created Entry!');
     // redirect to the testDataEntries page
   res.redirect('/web/testDataEntries');
  });
}

/**
* Show the edit form
*/
function showEdit(req, res) {
 TestDataEntry.findOne({ slug: req.params.slug }, (err, testDataEntry) => {
   res.render('pages/edit', {
     testDataEntry: testDataEntry,
     errors: req.flash('errors')
   });
 });
}

/**
* Process the edit form
*/
function processEdit(req, res) {
 // if there are errors, redirect and save errors to flash
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   req.flash('errors', errors.map(err => err.msg));
   return res.redirect(`/web/testDataEntries/${req.params.slug}/edit`);
 }
   // finding a current testDataEntry
 TestDataEntry.findOne({ slug: req.params.slug }, (err, testDataEntry) => {
   // updating that testDataEntry
   testDataEntry.email       = req.body.email;
   testDataEntry.description = req.body.description;
   testDataEntry.password    = req.body.password;
   testDataEntry.stages      = req.body.stages;
   testDataEntry.tags        = req.body.tags;
   testDataEntry.save((err) => {
   if (err)
     throw err;
     // success flash message
     req.flash('success', 'Successfully updated Entry.');
     res.redirect('/web/testDataEntries');
   });
 });
}

/**
* Delete an testDataEntry
*/
function deleteTestDataEntry(req, res) {

   // if there are errors, redirect and save errors to flash
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     req.flash('errors', errors.map(err => err.msg));
     return res.redirect(`/web/testDataEntries/${req.params.slug}/edit`);
   }

   TestDataEntry.remove({ slug: req.params.slug }, (err) => {
     // set flash data
     // redirect back to the testDataEntries page
     req.flash('success', 'Entry deleted!');
     res.redirect('/web/testDataEntries');
   });
 }




 // transform text into regex for search
 function escapeRegex(text) {
 	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
 }
