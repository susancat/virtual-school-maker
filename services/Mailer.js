const sendGrid = require("sendgrid");
const helper = sendGrid.mail;

const key = "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";

class Mailer extends helper.Mail {
    //classID &recipients come from email, content from template
    constructor({ classID, recipients }, content) {
      super();

      this.setApiKey = sendGrid(key);
      this.from_email = new helper.Email('irenez@daltonlearninglab.com');
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