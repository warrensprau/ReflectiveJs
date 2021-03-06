﻿// I provide a request-transformation method that is used to prepare the outgoing
// request as a FORM post instead of a JSON packet.

angular.module('requestUtils')
    .factory('transformRequestAsFormPost', function () {

        // I prepare the request data for the form post.
        function transformRequest(data, getHeaders) {

            var headers = getHeaders();

            headers['Content-Type'] = 'x-www-form-urlencoded';
            headers['access_token'] = 'bearer ' + localStorage.getItem("authorizationToken");
            var s = serializeData(data);
            return (s);
        }

        // Return the factory value.
        return (transformRequest);


        // ---
        // PRVIATE METHODS.
        // ---


        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData(data) {

            // If this is not an object, defer to native stringification.
            if (!angular.isObject(data)) {
                return ((data == null) ? '' : data.toString());
            }

            var buffer = [];

            // Serialize each key in the object.
            for (var name in data) {

                if (!data.hasOwnProperty(name)) {
                    continue;
                }

                var value = data[name];

                buffer.push(
                    encodeURIComponent(name) +
                    '=' +
                    encodeURIComponent((value == null) ? '' : value)
                );
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                .join('&')
                .replace(/%20/g, '+')
            ;

            return (source);
        }
    }
);
