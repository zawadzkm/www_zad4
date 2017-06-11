describe('Test update', function() {
    it('Login', function() {
        browser.get(browser.params.host+'/#!/login');

        element(by.model('username')).sendKeys(browser.params.username);
        element(by.model('password')).sendKeys(browser.params.password, protractor.Key.RETURN);
        element(by.binding('username')).getText()
                .then(function (value) {
                    expect(value).toEqual(browser.params.username);
                });
    });

    it('Update', function() {
        browser.get(browser.params.host+'/#!/update/170869');

        element(by.model('vote.number')).clear().sendKeys('13', protractor.Key.RETURN);
        element(by.id('message')).getText().then(function (value) {
            expect(value).toContain('Dane zmodyfikowane poprawnie');
        });
    });

});