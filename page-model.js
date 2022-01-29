import { Selector, t } from 'testcafe';
import XPathSelector from './xpath-selector';

class Page{
    constructor() {
        this.signUpLink          = Selector('[data-testid="sign-up-link"]');
        this.userNameInput       = Selector('input[name="username"]');
        this.passwordInput       = Selector('input[name="password"]');
        this.emailOrPhoneInput   = Selector('[name="emailOrPhone"]');
        this.fullName            = Selector('[name="fullName"]');
        this.submitButton        = Selector('button[type="submit"]');
        this.userProfile         = Selector('[data-testid="user-avatar"]');
        this.logoutButton        = Selector('[role="button"]');
        this.buttonTypeIdentifier= Selector('button[type="button"]');
        this.confirmationCode    = Selector('input[placeholder="Confirmation code"]');
    }

    async selectDropDown(title,value) {
        const select  = Selector('select[title="'+title+'"]');
        const options = select.find('option');
        await t
            .click(select)
            .click(options.withText(value));
    }

    async signIn(username,password,results) {
        await t
            .typeText(this.userNameInput,username)
            .typeText(this.passwordInput,password)
            .click(this.submitButton)
            .expect(XPathSelector(results).exists).ok();
    }

    async signOut () {
        await t
            .click(this.userProfile)
            .click(this.logoutButton.withText('Log out'));
    }

    async fillUserDetails(emailOrPhone,fullName,username,password) {
        await t
            .wait(1000)
            .click(this.signUpLink)
            .typeText(this.emailOrPhoneInput,emailOrPhone)
            .typeText(this.fullName,fullName)
            .typeText(this.userNameInput,username)
            .typeText(this.passwordInput,password)
            .click(this.submitButton);
    }

    async fillDateOfBirth(month,day,year) {
        await this.selectDropDown('Month:',month);
        await this.selectDropDown('Day:',day);
        await this.selectDropDown('Year:',year);
        await t
            .click(this.buttonTypeIdentifier.withText('Next'));
    }
}

export default new Page();


