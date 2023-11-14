# mqtt-forwarding

## summary:
This service acts as an intermediary between the MQTT broker and the GCP PubSub channels that are used to process packet data for the location-app. 

Why use this over a stateless app? The main reason to use this over a stateless app is that the packet rates are being actively tracked with heartbeat signals to measure packet rate even if there are no packets.

## to use:
```bash
yarn install
yarn start
```