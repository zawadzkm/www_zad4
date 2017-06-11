function checkModelValue(expected) {
  return function(value) {
    expect(value).toEqual(expected);
  }
}

describe('Test voivodeship data', function() {
    beforeEach (function(){
        browser.get(browser.params.host+'/#!/v/9');
    });

    it('Voivodeship stats data', function() {

        var results = [
            {name: 'area.entitled', value:'1552767'},
            {name: 'area.cards', value:'955463'},
            {name: 'area.votes', value:'955024'},
            {name: 'area.valid', value:'942421'},
            {name: 'area.invalid', value:'12603'},
            {name: 'area.attendance', value:'61.5'},
        ];

        for (i = 0; i < results.length; i++) {
            element(by.binding(results[i].name)).getText()
                .then(checkModelValue(results[i].value));
        }
    });


    it('Voivodeship candidates data', function() {
        results = ['7295', '1614', '90230', '12162', '251047', '370764', '41424', '13014', '141942', '1057', '9631', '2241'];
        element.all(by.repeater('c in area.candidates').column('c.votes'))
            .then(function (cells) {
                for (i = 0; i < cells.length; i++) {
                    cells[i].getText().then(checkModelValue(results[i]));

            };
        });
    });

});