
angular
    .module('persistence')

    .factory('entityManagerFactory', ['breeze', 'apiUrl', function(breeze, apiUrl) {

            var serviceName = apiUrl();
            magpieUrl = apiUrl();

            var factory = {
                newManager: function() { return new breeze.EntityManager(serviceName); },
                serviceName: serviceName
            };
            var manager = factory.newManager();
            var metadataStore = manager.metadataStore;

            function addToMetadataStore(modelName, propertyFunction) {
                metadataStore.registerEntityTypeCtor(modelName, propertyFunction);
            }

            //addToMetadataStore('Associate', function () { this.Name = ''; });

            return manager;
        }
    ]);

