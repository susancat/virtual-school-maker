//used by sendGrid for generation heloper:Mailer
module.exports  = email => {
    return `
        <html>
            <body>
                <div style="text-align: center;">
                    <h3>Please click the following link to enroll in the class</h3>
                    <p>Please make sure to input corrent classID in Roblox game: ${email.classID}</p>
                    <p>${email.text}</p>
                </div>
            </body>
        </html>
    `;
};