exports.config = {
    framework: 'jasmine',

    capabilities: {
        'browserName': 'chrome'
    },

    specs: ['test_country.js', 'test_voivodeship.js', 'test_district.js', 'test_commune.js',
        'test_search.js', 'test_login.js', 'test_update.js'],

    params: {
        host: 'http://localhost:8000',
        username: 'test1',
        password: 'test1'
    }
}