const AthenaExpress = require("athena-express");
//Importing the AWS SDK
const AWS = require("aws-sdk");

//UUID for job id
const { v4: uuidv4 } = require('uuid');
// Configuring the region and credentials to make connection to AWS Athena
 const awsCredentials = {
    region: "us-west-2",
 	accessKeyId: "AKIAXNX4HWDXNJSPGSBQ",
 	secretAccessKey: "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"
 };
 AWS.config.update(awsCredentials);
//configuring athena-express with aws sdk object
 const athenaExpressConfig = { aws: AWS,
	getStats: true }; 
 // Creating Athena Express service object
 const athenaExpress = new AthenaExpress(athenaExpressConfig);

 function getting_user_prediction(startDate, endDate){
    let myQuery = {
        sql : "SELECT * FROM user_predictions",
        db : "brackets_analytics"
    };

    const labels_arr = []
    const data_arr = []
    athenaExpress
	.query(myQuery)
	.then(results => {
        for (var i = 0; i < results.Items.length; i++){
            var obj = results.Items[i];
            labels_arr.push(obj.date);
            data_arr.push(obj.users)
          }
		console.log(results.Items);
	})
	.catch(error => {
		console.log(error);
	});   
    
    return {labels:labels_arr, data:data_arr}
}

getting_user_prediction();