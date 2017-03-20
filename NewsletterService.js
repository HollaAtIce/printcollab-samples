// using standard js so no semicolons
// the service for newsletter api, initally made all http methods but just post below

/* global angular */
angular.module('public.newsletter')
    .factory('NewsletterService', NewsletterService)

NewsletterService.$inject = ['$http']

function NewsletterService($http) {
    return {
        insertEmail
    }

    function insertEmail(member, onSuccess, onError) {
        return $http.post('api/newsletter/members/', member)
            .then((response) => {
                onSuccess(response)
            })
            .catch((response) => {
                onError(response)
            })
    }
}
