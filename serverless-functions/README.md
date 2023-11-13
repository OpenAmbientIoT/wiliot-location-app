# cloud-functions
these functions should be deployed in a serless function environemnt like AWS Lambda or GCP Cloud Functions

## functions included and uses
`eventhandler.js` is triggered by a Kafka cluster. Confluent Kafka sends data directly with their connector in a non-traditional format. 
- {a=jfk, b=uio} compared to {a:"jfk",b:"uio"}

`manageWaveletPackets.js` is triggered by updates on the wavelet document in the database. It manages which tags should be listened to for the selected asset.

`packethandler` is triggered by a distributed messaging queue like Amazon SNS or GCP PubSub. It processes each packet and updates the document DB respectively.

`processSelectedAssetEvents.js` is triggered by incoming packets in the messaging queue as well. It will only update records in the wavelet document if any assets are selected. If no assets are selected then no updates will be made to the DB.