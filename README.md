# wiliot-location-app

## app overview
**user-view**
The user-view
![user-view](readme-assets/app-screenshots/admin-view.png)

**admin-view**
![admin-view](readme-assets/app-screenshots/admin-view.png)

## development

### react-app
1. go into react-app dirtory with `cd react-app`
2. run `yarn install` to install all the dependenceis
3. run `yarn run start` to start development server

### serverless-functions


These functions should be deployed in a serless function environemnt like AWS Lambda or GCP Cloud Functions. The functions directoty contains 4 functions. 2 for backend tasks and 2 for frontend UI management.

`eventHandler.js` processes incoming events from Kafka. Triggered by the Confluent Kafka connector for serverless functions. Confluent Kafka sends data directly with their connector in a non-traditional format. 
- {a=jfk, b=uio} compared to {a:"jfk",b:"uio"}
- 
`packetHandler.js` processes incoming packets from a messaging queue.

`manageWaveletPackets.js` manages which asset packets will be tracked and if any will be processes at all. It is triggered by changes on the wavelet collection.

`processSelectedAssetEvents.js` processes packets from a messaging queue. It will update the wavelet collection with new records. It is triggered by the messaging queue, but it conditionally processes messages fully based on the wavelet collection that is controlled by the manageWaveletPackets function.


### mqtt-forwarding
This service acts as an intermediary between the MQTT broker and the GCP PubSub channels that are used to process packet data for the location-app. 

Why use this over a stateless app? The main reason to use this over a stateless app is that the packet rates are being actively tracked with heartbeat signals to measure packet rate even if there are no packets.

**to use it**
```bash
yarn install
yarn start
```