function checkModelValue(expected) {
  return function(value) {
    expect(value).toEqual(expected);
  }
}

describe('Test commune data', function() {

    beforeEach (function(){
        browser.get(browser.params.host+'/#!/c/180709');
    });

    it('Commune stats data', function() {

        var results = [
            {name: 'area.entitled', value:'6723'},
            {name: 'area.cards', value:'3528'},
            {name: 'area.votes', value:'3526'},
            {name: 'area.valid', value:'3459'},
            {name: 'area.invalid', value:'67'},
            {name: 'area.attendance', value:'52.45'},
        ];

        for (i = 0; i < results.length; i++) {
            element(by.binding(results[i].name)).getText()
                .then(checkModelValue(results[i].value));
        }
    });

    it('Commune candidates data', function() {
        results = ['29', '4', '431', '49', '595', '1493', '242', '46', '514', '3', '37', '16'];
        element.all(by.repeater('c in area.candidates').column('c.votes'))
            .then(function (cells) {
                for (i = 0; i < cells.length; i++) {
                    cells[i].getText().then(checkModelValue(results[i]));

            };
        });
    });

});