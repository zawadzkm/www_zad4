describe('Test searches', function() {

    it('Search circuit', function() {
        browser.get(browser.params.host+'/#!/ccsearch');

        element(by.model('query')).sendKeys('odrzy', protractor.Key.RETURN);
        element.all(by.repeater('c in data.results')).count()
            .then(function (value) {
                expect(value).toEqual(5);
            });
    });

    it('Search commune', function() {
        browser.get(browser.params.host+'/#!/csearch');

        element(by.model('query')).sendKeys('woja', protractor.Key.RETURN);
        element.all(by.repeater('c in data.results')).count()
            .then(function (value) {
                expect(value).toEqual(2);
            });
    });

    it('Search district', function() {
        browser.get(browser.params.host+'/#!/dsearch');

        element(by.model('query')).sendKeys('kr', protractor.Key.RETURN);
        element.all(by.repeater('c in data.results')).count()
            .then(function (value) {
                expect(value).toEqual(4);
            });
    });

    it('Search voivodeship', function() {
        browser.get(browser.params.host+'/#!/vsearch');

        element(by.model('query')).sendKeys('ma', protractor.Key.RETURN);
        element.all(by.repeater('c in data.results')).count()
            .then(function (value) {
                expect(value).toEqual(3);
            });
    });

});