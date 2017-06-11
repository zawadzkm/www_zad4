function checkModelValue(expected) {
  return function(value) {
    expect(value).toEqual(expected);
  }
}

describe('Test country data', function() {

    beforeEach (function(){
        browser.get(browser.params.host);
    });

    it('Country stats data', function() {

        var results = [
            {name: 'area.entitled', value:'29122304'},
            {name: 'area.cards', value:'17798791'},
            {name: 'area.votes', value:'17789231'},
            {name: 'area.valid', value:'17598919'},
            {name: 'area.invalid', value:'190312'},
            {name: 'area.attendance', value:'61.08'},
        ];

        for (i = 0; i < results.length; i++) {
            element(by.binding(results[i].name)).getText()
                .then(checkModelValue(results[i].value));
        }
    });

    it('Country candidates data', function() {
        results = ['89002', '38672', '1047949', '252499', '2739621', '9485224', '537570', '139682', '3044141', '17164', '178590', '28805'];
        element.all(by.repeater('c in area.candidates').column('c.votes'))
            .then(function (cells) {
                for (i = 0; i < cells.length; i++) {
                    cells[i].getText().then(checkModelValue(results[i]));

            };
        });
    });

});