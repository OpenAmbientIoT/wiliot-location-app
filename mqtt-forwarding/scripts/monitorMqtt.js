/**
 * MQTT Client Initialization Script
 * 
 * This script sets up and initializes an MQTT client using the MQTT.js library.
 * It connects to an MQTT broker using credentials and configurations defined in environment variables.
 * The client subscribes to a specified topic and handles incoming messages.
 * 
 * Environment Variables:
 * - MQTT_BROKER_URI: URI of the MQTT broker
 * - MQTT_USERNAME: Username for MQTT authentication
 * - MQTT_PASSWORD: Password for MQTT authentication
 * - MQTT_PORT: Port number for the MQTT broker
 * - MQTT_TOPIC: Topic to subscribe to (use '#' for all topics)
 * - ID_ATTRIBUTE: Custom attribute for additional functionality (currently unused)
 * 
 * The client logs connection status, subscription status, and incoming messages.
 * It also handles errors in connection and message processing.
 */

import mqtt from 'mqtt';

// Extracting MQTT configurations from environment variables
const mqttBrokerUri = process.env.MQTT_BROKER_URI;
const mqttUsername = process.env.MQTT_USERNAME;
const mqttPassword = process.env.MQTT_PASSWORD;
const mqttPort = process.env.MQTT_PORT;
const topic = process.env.MQTT_TOPIC; // '#' for all topics

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
 * and handle incoming messages and errors.
 * 
 * @return {mqtt.MqttClient} The initialized MQTT client.
 */
const initializeClient = () => {
    const client = mqtt.connect(mqttOptions);

    client.on('connect', () => {
        console.log('Connected to HiveMQ');
        client.subscribe(topic, { qos: 0 }, (err) => {
            if (err) {
                console.error('Failed to subscribe:', err);
            } else {
                console.log('Subscribed to topic:', topic);
            }
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const parsedData = JSON.parse(message.toString());
            console.log('Received message:', JSON.stringify(parsedData));
        } catch(err) {
            console.error('Failed to process message:', err);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT connection error:', err);
    });

    return client;
}

// Initialize the MQTT client
initializeClient();
