const CLIENT_ID = '892530947294-gof1jnfl18h7i2cmpa5p8ajps4gsqa21.apps.googleusercontent.com'
// const clientSecret = 'VBVF33_Blfdm5b9P5acMei-X'
const API_KEY = 'AIzaSyDJ2kE0omz7jfnTB-SkPsvvq1NTSTgzQSU'

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive';

import { drive } from '../stores'

/**
 * get target folder to work with.
 */
 export function getTarget() {
  gapi.client.drive.files.list({
    'pageSize': 1,
    'fields': "files(id)",
    q: "name='Document Organizer WebApp'"
  }).then(function({result}) {
    if (result?.files.length) {
      drive.targetId(result.files[0].id)
    }
  });
}

/**
 * get target's files.
 */
export function getFiles(filter) {
  let q = `'${drive.getTargetId()}' in parents and trashed = false`

  if (filter) {
    q += `and name contains '${filter}'`
  }

  return gapi.client.drive.files.list({
    'pageSize': 10,
    // 'fields': "files",
    'fields': "files(id, name, mimeType, thumbnailLink, webViewLink, appProperties)",
    q
  }).then(function({result}) {
    drive.files(result)
  });
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
export function updateSigninStatus(isSignedIn) {
 if (isSignedIn) {
    drive.auth(true)
    getTarget();
 } else {
  drive.auth(false)
 }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export function initClient () {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function (e) {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function(error) {
    console.error(error)
  });
}