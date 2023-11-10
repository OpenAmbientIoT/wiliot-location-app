const admin = require('firebase-admin');
const functions = require('@google-cloud/functions-framework');



const AUTH_KEY = process.env.AUTH_KEY;

admin.initializeApp();
const db = admin.firestore();
const DBCollection = 'assets-test';

function getValueAfterComma (inputString) {
  var splitString = inputString.split(',');

  // If there's more than one segment, return the second one (trimming leading/trailing whitespace)
  if (splitString.length > 1) {
      return splitString[1].trim();
  }
  // If no comma, return null
  return inputString;
}

function convertToJson(inputString) {
  // Step 0: Remove "keySet" and everything to its right, then add a closing brace
  inputString = inputString.replace(/,\s*keySet.*$/, '') + '}';

  // Step 1: Decode HTML entities for double quotes
  inputString = inputString.replace(/&#34;/g, '"');

  // Step 2: Explicitly handle the first 'value' field with comma-separated values, ensuring they are within quotes
  // This will only target the first occurrence of the "value" attribute.
  inputString = inputString.replace(
    /value="?([^,]*)"?,"?([^,"}]*)"?/,
    (match, p1, p2) => `value:"${p1.trim()},${p2.trim()}"`
  );

  // Step 3: Replace = with : and add double quotes around non-numeric values
  let formattedString = inputString.replace(/=([a-zA-Z_][a-zA-Z0-9_\-\.]*)(?=[,}])/g, ':"$1"'); // Non-numeric values
  formattedString = formattedString.replace(/=([0-9.]+)/g, ':$1'); // Handle numeric values

  // Step 4: Handle special cases for objects or arrays
  formattedString = formattedString.replace(/:"{/g, ':{');
  formattedString = formattedString.replace(/}",/g, '},');
  formattedString = formattedString.replace(/"\[/g, '[');
  formattedString = formattedString.replace(/\]"/g, ']');

  const regex = /(\s*)([a-zA-Z0-9_]+)(\s*):/g;

  // This function adds quotes around the key
  const replacer = (match, p1, p2, p3) => {
    return `${p1}"${p2}"${p3}:`;
  };

  formattedString = formattedString.replace(regex, replacer);
  formattedString = formattedString.slice(0,-1)

  // Step 5: Parse the string to JSON
  try {
    // console.log("formattedstring");
    console.log(formattedString);
    const jsonObject = JSON.parse(formattedString); // Ensure the entire string is treated as an object
    return jsonObject;
  } catch (error) {
    console.error('Error parsing to JSON:', error);
    return null;
  }
}


async function handleAssetLocationEvent(eventData) {
  const assetId = eventData.assetId;

  // update poi in db
  const docRef = db.collection(DBCollection).doc(assetId);

  try {
    const doc = await docRef.get();
    const parsedLocationValue = getValueAfterComma(eventData.value);
    
    if (!doc.exists) {
      await docRef.set({
        id: assetId,
        name: assetId,
        poiId: "",
        poiIdEvent: parsedLocationValue,
        poiIdPacket: "",
        temperature: "",
        isVisible: true,
        rssi: "",
        bridgeId: "",
        lastModifiedTimestamp: new Date(),  // The time when this document is created
      });
    } else {
      await docRef.update({
        "poiIdEvent": parsedLocationValue,
        "lastModifiedTimestamp": new Date()
      });
    }
  } catch (error) {
    console.log("Error getting or updating document:", error);
  }
}





functions.http('processEvent', async (req, res) => {
  
    try {


      if (req.method !== 'POST') {
        // Only accept POST requests.
        res.status(405).send('Method Not Allowed');
        return;
      }

      // check that req.header.Authorization === AUTH_KEY
      // encode header key to base 64
      // console.log("req.header.token: " + req.headers.token);
      // const encodedHeaderKey = Buffer.from(String(req.headers.token)).toString('base64');
      // console.log("encodedHeaderKey: " + encodedHeaderKey);
      // if (encodedHeaderKey !== AUTH_KEY) {
      //   console.error('Error processing event: invalid auth key');
      //   res.sendStatus(401);
      //   return;
      // }

      // Parse the Pub/Sub message data
      let eventData;
      // try{
        eventData = convertToJson(req.body[0].value);
      // } catch(error) {
      //   eventData = req.body
      //   console.log("direct", eventData)
      // }
      

      // quit from buggy assets from platform
      switch(eventData.assetId) {
        case 'oreos':
        case 'mnms':
        case 'rice_krispies':
        case 'snickers':
        case 'welch_fruit_snacks':
          console.error("ERROR: Handling deleted asset")
          res.sendStatus(400);
          return
        default:
          break;
      }

      // console.log("event data");
      // console.log(JSON.stringify(eventData));
      
      // parse kind of event
      switch (eventData.eventName) {
        case "assetLocation":
        case "demoAssetLocation":
          await handleAssetLocationEvent(eventData);
          res.sendStatus(200);
          break;
        case "location":
        default:
          console.log("Event not handled: " + eventData.eventName);
          res.sendStatus(400);
          break;
      }
      // res.sendStatus(200);
    } catch (error) {
      console.error('Error processing event', error);
      res.sendStatus(500);
    }
})
