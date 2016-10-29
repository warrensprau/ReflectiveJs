
angular
    .module('persistence')
    .factory('entityManagerFactory', ['breeze', 'apiUrl', function(breeze, apiUrl) {

            var serviceName = apiUrl() + '/api';
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

            addToMetadataStore('Associate', function () { this.Name = ''; });
            addToMetadataStore('Account', function () { this.Name = ''; });
            addToMetadataStore('CatalogueItem', function () { this.Name = ''; });
            addToMetadataStore('FulfillmentOption', function () { this.Name = ''; });
            addToMetadataStore('Offering', function () { this.Name = ''; });
            addToMetadataStore('Order', function () { this.Name = ''; });
            addToMetadataStore('Goal', function () { this.Name = ''; });
            //addToMetadataStore('AddAccountCommentAction', function () { this.CommentTypeId = 'CommentType_Info' });

            addToMetadataStore('OrdersExport', function () { this.IsAction = true; });

            return manager;
        }
    ]);

