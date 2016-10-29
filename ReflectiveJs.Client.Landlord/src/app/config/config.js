angular.module('config', [])

.constant('package', { author: { name: 'Magpie Software Ltd', url: 'www.somehomepageforcorvussoftware', email: 'someemail@courvusltd.com' }, description: 'Corvus.Magpie.Client.Spa', devDependencies: { bower: '^1.5.2', grunt: '^0.4.5', 'grunt-bower-task': '^0.4.0', 'grunt-bump': '0.3.0', 'grunt-cache-breaker': '^2.0.1', 'grunt-cli': '^0.1.13', 'grunt-contrib-clean': '~0.6.0', 'grunt-contrib-compress': '~0.13.0', 'grunt-contrib-concat': '~0.5.1', 'grunt-contrib-copy': '~0.8.1', 'grunt-contrib-cssmin': '~0.12.2', 'grunt-contrib-jshint': '~0.11.1', 'grunt-contrib-htmlmin': '0.6.0', 'grunt-contrib-sass': '~0.9.2', 'grunt-contrib-uglify': '~0.8.0', 'grunt-contrib-watch': '~0.6.1', 'grunt-dom-munger': '~3.4.0', 'grunt-filerev': '~2.3.1', 'grunt-html2js': '~0.3.4', 'grunt-include-source': '~0.7.1', 'grunt-ng-annotate': '~1.0.1', 'grunt-ng-constant': '^1.1.0', 'grunt-open': '~0.2.3', 'grunt-replace': '^0.10.2', 'grunt-string-replace': '^1.2.0', 'grunt-targethtml': '~0.2.6', 'grunt-usemin': '~3.1.1', wiredep: '^3.0.0-beta', 'grunt-wiredep': '~2.0.0', jshint: '~2.8.0', 'load-grunt-config': '^0.17.2', 'load-grunt-tasks': '^3.2.0', 'time-grunt': '^1.2.1' }, homepage: 'www.somehomepageformagpie.com', license: 'Private', name: 'Corvus.Magpie.Client.Spa', private: true, version: '0.1.0' })

.constant('ENV', { name: 'devtesting', apiEndpoint: 'http://localhost:63305' })

.constant('magpieUrl', 'http://localhost:63305')

;