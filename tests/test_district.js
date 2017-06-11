function checkModelValue(expected) {
  return function(value) {
    expect(value).toEqual(expected);
  }
}

describe('Test district data', function() {
    beforeEach (function(){
        browser.get(browser.params.host+'/#!/d/40');
    });

    it('Voivodeship stats data', function() {

        var results = [
            {name: 'area.entitled', value:'366951'},
            {name: 'area.cards', value:'218346'},
            {name: 'area.votes', value:'218221'},
            {name: 'area.valid', value:'215326'},
            {name: 'area.invalid', value:'2895'},
            {name: 'area.attendance', value:'59.47'},
        ];

        for (i = 0; i < results.length; i++) {
            element(by.binding(results[i].name)).getText()
                .then(checkModelValue(results[i].value));
        }
    });

    it('District candidates data', function() {
        results = ['1864', '374', '18634', '3013', '51900', '92397', '10066', '2622', '31414', '277', '2268', '497'];
        element.all(by.repeater('c in area.candidates').column('c.votes'))
            .then(function (cells) {
                for (i = 0; i < cells.length; i++) {
                    cells[i].getText().then(checkModelValue(results[i]));

            };
        });
    });

});