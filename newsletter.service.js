 // using standard js so no semicolons
//my server side service for mailchimp api

 module.exports = newsletterService
 const mailchimp = require('mailchimp-v3')
 const mailchimpList = process.env.MAILCHIMP_LIST
 mailchimp.setApiKey(process.env.MAILCHIMP_API_KEY)

 function newsletterService() {
     return {
         insertEmail
     }

     function insertEmail(member) {
         return mailchimp.post('lists/' + mailchimpList + '/members/', member)
     }
 }
