import page from './page-model';
import imapConnect from  './imapG';

const userCred          = require('./credential_data.json');
const userAccountInfo   = require('./userAccount_data.json');

fixture `User Validation`
    .page `https://www.instagram.com/`;

userCred.forEach(data => {
    test(`Verify User Sign In with '${data.scenario}'`,async t => {
        await t
            .maximizeWindow();
        await page.signIn(data.userName,data.password,data.results);
    }); 
});      

/*test(`Verify sign Out`,async t => {
    await page.signIn(userCred[0].userName,userCred[0].password);
    await page.signOut();
});

userAccountInfo.forEach(data => {
    test(`Create Account with '${data.scenario}'`,async t =>{
      await t
            .maximizeWindow();
        await page.fillUserDetails(data.emailOrPhone,data.fullName,data.userName,data.password);
        await page.fillDateOfBirth(data.month,data.day,data.year);
        await t
            .wait(10000);
        const otp = await imapConnect('sdlc.automationtesting2@gmail.com','%cr8&CiaL');
        console.log('otp:',otp); 
      await t
            .typeText(page.confirmationCode,otp)
            .click(page.submitButton.withText('Next'));
    });
}); */