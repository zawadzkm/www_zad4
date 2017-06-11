describe('Test login/logout', function() {
    it('Login', function() {
        browser.get(browser.params.host+'/#!/login');

        element(by.model('username')).sendKeys(browser.params.username);
        element(by.model('password')).sendKeys(browser.params.password, protractor.Key.RETURN);
        element(by.binding('username')).getText()
                .then(function (value) {
                    expect(value).toEqual(browser.params.username);
                });
    });

    it('Logout', function() {
        browser.get(browser.params.host+'/#!/logout');

        element(by.binding('username')).getText()
                .then(function (value) {
                    expect(value).toEqual('');
                });
    });

    it('Failed login', function() {
        browser.get(browser.params.host+'/#!/login');

        element(by.model('username')).sendKeys('xxxxx');
        element(by.model('password')).sendKeys('xxxxx', protractor.Key.RETURN);
        element(by.id('message')).getText().then(function (value) {
            expect(value).toContain('Błąd logowania');
        });
    });

});