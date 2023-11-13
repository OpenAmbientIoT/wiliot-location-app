/**
 * MQTT to Google Cloud Pub/Sub Bridge
 * 
 * This script establishes a connection to an MQTT broker and subscribes to a specified topic.
 * When messages are received on this topic, they are forwarded to a Google Cloud Pub/Sub topic.
 * 
 * Environment Variables:
 * - MQTT_BROKER_URI: URI of the MQTT broker
 * - MQTT_USERNAME: Username for MQTT authentication
 * - MQTT_PASSWORD: Password for MQTT authentication
 * - MQTT_PORT: Port number for the MQTT broker
 * - MQTT_TOPIC: MQTT topic to subscribe to (use '#' for all topics)
 * - CLOUD_PROJECT_ID: Google Cloud Project ID
 * - MESSAGING_Q_TOPIC: Google Cloud Pub/Sub topic for forwarding messages
 * 
 * The script logs the status of MQTT connection, subscription, message reception,
 * and the status of message forwarding to Google Cloud Pub/Sub.
 */

import mqtt from 'mqtt';
import { PubSub } from '@google-cloud/pubsub';

// Environment variables for MQTT and Google Cloud Pub/Sub
const mqttBrokerUri = process.env.MQTT_BROKER_URI;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;
const mqttPort = process.env.MQTT_PORT;
const mqttTopic = process.env.MQTT_TOPIC; // '#' for all topics
const projectId = process.env.CLOUD_PROJECT_ID; // Replace with your GCP project ID
const packetTopic = process.env.MESSAGING_Q_TOPIC;

// Initialize Google Cloud Pub/Sub client
const pubsub = new PubSub({ projectId });

// MQTT client options
const mqttOptions = {
    host: mqttBrokerUri,
    port: mqttPort,
    username: mqttUsername,
    password: mqttPassword,
    protocol: "mqtts", // default mqtt secure
    clean: true, // ensures no messages are sent when offline
};

/**
 * Initializes and returns an MQTT client.
 * The client is configured to connect to the broker, subscribe to a topic,
 * and handle incoming messages by forwarding them to Google Cloud Pub/Sub.
 * 
 * @return {mqtt.MqttClient} The initialized MQTT client.
 */
const initializeClient = () => {
    const client = mqtt.connect(mqttOptions);

    client.on('connect', () => {
        console.log('Connected to HiveMQ');
        client.subscribe(mqttTopic, { qos: 0 }, (err) => {
            if (err) {
                console.error('Failed to subscribe:', err);
            } else {
                console.log('Subscribed to topic:', mqttTopic);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const parsedData = JSON.parse(message.toString());
            const jsonMessage = JSON.stringify(parsedData);
            const eventMessageId = await pubsub.topic(packetTopic).publish(Buffer.from(jsonMessage));
            console.log(`Message ${eventMessageId} published to ${packetTopic}.`, jsonMessage);
        } catch(err) {
            console.error('Failed to publish to Cloud Pub/Sub:', err);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT connection error:', err);
    });

    return client;
}

// Initialize the MQTT client
initializeClient();
