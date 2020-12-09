const sendGrid = require("sendgrid");
const helper = sendGrid.mail;
const keys = require('../config/keys');

const key = keys.sendGridKey;
//const key = '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';
class Mailer extends helper.Mail {
    //classID &recipients come from email, content from template
    constructor({ classID, recipients }, content) {
      super();

      this.setApiKey = sendGrid(key);
      this.from_email = new helper.Email('developer@daltonlearninglab.com');
      this.classID = classID;
      this.text = new helper.Content('text/html', content);
      this.recipients = this.formatAddresses(recipients);
  
      this.addContent(this.text);
      this.addRecipients();
    }
  
    formatAddresses(recipients) {
      return recipients.map(({ email }) => {
          //this email is from recipient model
        return new helper.Email(email);
      });
    }
  
    addRecipients() {
      const personalize = new helper.Personalization();
  
      this.recipients.forEach(recipient => {
        personalize.addTo(recipient);
      });
      this.addPersonalization(personalize);
    }
  
    async send() {
      const request = this.setApiKey.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        text: this.toJSON()
        //convert to JSON and send to sendGrid
      });
  
      const response = await this.setApiKey.API(request);
      return response;
    }
  }
  
  module.exports = Mailer;
