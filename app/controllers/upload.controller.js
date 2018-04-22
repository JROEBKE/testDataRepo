var TestDataEntry = require('../models/testDataEntry');
var json2csv = require('json2csv');

module.exports = {
  showUpload: showUpload,
  processUpload: processUpload,
  showUploadTemplate: showUploadTemplate
}



 /**
  * Show the upload form
  */
 function showUpload(req, res) {
   res.render('pages/upload', {
     errors: req.flash('errors')
   });
 }

 /**
  * Process upload form
  */
 function processUpload(req, res) {
    var csv = require('fast-csv');
    var mongoose = require('mongoose');
   	if (!req.files)
   		return res.status(400).send('No files were uploaded.');

   	var testDataEntriesFile = req.files.file;
   	var testDataEntries = [];

   	csv
   	 .fromString(testDataEntriesFile.data.toString(), {
   		 headers: true,
   		 ignoreEmpty: true,
       quote:'"',
       trim: true
   	 })

     //sample validator wrong
     .validate(function(data){
         return data.tags <18; //sample
     })
     .on("data-invalid", function(data){
       req.flash('errors', data.email + ' has an issue!');
       return res.redirect('/upload');
     })

   	 .on("data", function(data){
   		 data['_id'] = new mongoose.Types.ObjectId();
       console.log(data);

       // only creation of new data no update
   		 testDataEntries.push(data);
   	 })
   	 .on("end", function(){

   		 TestDataEntry.create(testDataEntries, function(err, documents) {
         if (11000 === err.code || 11001 === err.code){
           console.log(err);
           req.flash('errors', err.message + 'is already used!'); //validation error does not show why check mongoose documentation to be more precise
           return res.redirect('/upload');
         }
         if (err){
           console.log(err);
           req.flash('errors', 'Sorry there is an issue with your upload!');
           return res.redirect('/upload');
         }

       // set a successful flash message
       req.flash('success', testDataEntries.length + ' entries successfully created');
       // redirect to the testDataEntries page, redirect to upload does not work with success
       res.redirect('/testDataEntries');
       // res.redirect('/upload');

   		 });

   	 });
}



/**
 * Template download not yet working !!!
 */
 function showUploadTemplate(req, res) {

 	//var fields = Object.keys(Author.schema.obj);
 	var fields = [
 		'email',
 		'description'

 	];

 	var csv = json2csv({ data: '', fields: fields });

 	res.set("Content-Disposition", "attachment;filename=authors.csv");
 	res.set("Content-Type", "application/octet-stream");

 	res.send(csv);

};
