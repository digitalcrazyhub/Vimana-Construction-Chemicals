// Deploy as a Web app: Execute as Me, access for Anyone with the URL.
// Keep the deployed URL private and place it in GOOGLE_SHEET_WEBHOOK.
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Vimana Leads');
  if (!sheet) throw new Error('Create a sheet tab named Vimana Leads first.');
  sheet.appendRow([
    data.fullName || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
