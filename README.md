# Wiliot Location App

Utilize Wiliot tags to find assets.

## Table of Contents
1. [About the Project](#about-the-project)
2. [Prerequisites](#prerequisites)
3. [Technologies](#technologies)
4. [Installation](#installation)
   - [React App](#react-app)
   - [Serverless Functions](#serverless-functions)
   - [Initializing the Database](#initializing-the-database)
   - [Kafka](#kafka)
   - [MQTT Broker](#mqtt-broker)
5. [App Overview](#app-overview)
   - [User-view](#user-view)
   - [Admin-view](#admin-view)
6. [License](#license)


## About the Project
This project is an open-source initiative under the MIT license, focusing on utilizing Wiliot tags for efficient asset tracking and management.

## Prerequisites
<a name="prerequisites"></a>
Before you begin, ensure you have met the following requirements:
* Node.js and npm installed on your system.
* Access to a Firebase or Amazon DynamoDB account for cloud database services.
* Familiarity with serverless functions.
* A virtual machine or environment to run MQTT broker code.
* Basic knowledge of React and JavaScript.

## Technologies
<a name="technologies"></a>
This project uses the following technologies:
* React.js for the frontend development.
* Node.js as the JavaScript runtime environment.
* Firebase or Amazon DynamoDB for cloud-based database services.
* Serverless functions for backend processes.
* MQTT Broker for message queuing telemetry transport.
* Kafka for event streaming.


## Installation
<a name="installation"></a>
### React App
Follow these steps to install the Wiliot Location React App:
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/OpenAmbientIoT/wiliot-location-app.git

2. Install the dependencies for React app:
   ```bash
   cd react-app
   yarn install
   ```
3. Run the app:
   ```bash
    yarn start
    ```

### Serverless Functions

Follow AWS or Google Cloud Doucmentation to deploy the serverless functions. The functions directory contains 4 functions. 2 for backend tasks and 2 for frontend UI management.
Deploy functions in an environment like AWS Lambda or GCP Cloud Functions:
* `eventHandler.js`: Processes incoming events from Kafka.
* `packetHandler.js`: Processes incoming packets from a messaging queue.
* `manageWaveletPackets.js`: Manages asset packet tracking.
* `processSelectedAssetEvents.js`: Processes packets and updates the wavelet collection.

### Initializing the database
Upload preliminary information into the database as follows:
* **assets**: Auto-populates as information is received. Example [here](readme-assets/document-db-examples/assets-example.json).
* **bridge-mapping-details**: Initialize with bridges used in the UI. Example [here](readme-assets/document-db-examples/bridge-mapping-details-example.json).
* **locations**: Initialize with specific information found [here](readme-assets/document-db-examples/locations-example.json).
* **tag-asset-mapping**: Key:value store for tagIds:assetIds. Example [here](readme-assets/document-db-examples/tag-asset-mapping-example.json).
* **wavelet**: Manages state of tracked assets and packets. Example [here](readme-assets/document-db-examples/wavelet-example.json).
* **zone-mapping**: Contains extra location information and links to imageURLs.

### Kafka

Use Confluent or similar kafka brokers and follow the documentation to deploy the broker. The broker directory contains the code for the broker. It is a simple Kafka broker that forwards Wiliot Events to a messaging queue. You can use connectors to forward
events to AWS or GCP using connectors. 


### MQTT Broker

Follow the documentation for the MQTT Broker to deploy the broker. The broker directory contains the code for the broker. It is a simple MQTT broker that forwards messages to a messaging queue. It is written in Node.js.
This service acts as a bridge between the MQTT broker and the  PubSub channels for processing packet data.
```bash
yarn install
yarn start
```

## App Overview
<a name="app-overview"></a>
### User-view
The user-view allows users to view their assets' locations. It includes a 'bubble' view for an overview and a 'selected' or 'searched' view for specific assets. Assets are located either through event location or heatmap location.

Currently packets are an internal feature to Wiliot. These two location types have a tradeoff between speed, heatmap, and accuracy, event. Heatmap located assets are fast, but have lots of noise. Event located assets are slower, but have extremely high accuracy.


![User View Bubble](readme-assets/app-screenshots/user-view-bubble.png)
![User View Selected](readme-assets/app-screenshots/user-view-selected.png)

### Admin-view
In the admin view, bridges are placed on a map using scalable SVG. Specific bridges receive packets, and events render based on the average location for bridges in their zone.

![Admin View](readme-assets/app-screenshots/admin-view.png)

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.