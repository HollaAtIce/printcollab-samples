/* global angular */
'use strict'

angular.module('app.campaigns') //
    .factory('CampaignsService', CampaignsServiceFactory) // whats this factory business?

CampaignsServiceFactory.$inject = ['$http', 'StoreService']

function CampaignsServiceFactory($http, StoreService) {
    return {
        insert: insert,
        getOne: getOne,
        removeOne: removeOne,
        updateOne: updateOne,
        getAll: getAll,
        getCountByCampaignId,
        chargeCampaign
    }

    // charge campaigns
    function chargeCampaign(campaignId, onSuccess, onError) {
        return $http.get('/api/campaigns/' + campaignId + '/charge')
            .then((response) => {
                onSuccess(response.body)
            })
            .catch((response) => {
                onError(response.body)
            })
    }

    // post
    function insert(data, onSuccess, onError) { // accepting two function as parameters... ,
        return $http.post('/api/campaigns/', data)
            .then((response) => { // '.then run function 'onSuccess', once promis is resolved //returns $http. $http is angulars service that allows you to make ajax / xml calls ,  specifically  the .get
                onSuccess(response.data) // send response data back to controller
                var userId = response.data.item.user_id
                StoreService.getStoreByUserId(userId, campaignSuccess, campaignError)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    // campaign success
    function campaignSuccess(data) {
        var current = data.item
        if (!current) {
            StoreService.getStoreByUserId('58810283eef91c9c69155d39', campaignSuccess, campaignError)
        } else {
            StoreService.updateStore(current, data)
            console.log('store updated')
        }
    }

    // campaign error
    function campaignError() {
        console.log('unable to get store')
    }

    // get all
    function getAll(onSuccess, onError) {
        return $http.get('/api/campaigns/')
            .then((response) => {
                onSuccess(response.data)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    function getCountByCampaignId(id, onSuccess, onError) {
        $http.get('/api/orders/ordersForCampaign/' + id)
        .then((response) => {
            onSuccess(response.data)
        })
        .catch((response) => {
            onError(response.data)
        })
    }

    // get by ID
    function getOne(id, onSuccess, onError) {
        return $http.get('/api/campaigns/' + id)
            .then((response) => {
                onSuccess(response.data)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    // update by ID
    function updateOne(id, data, onSuccess, onError) {
        return $http.put('/api/campaigns/' + id, data)
            .then((response) => {
                onSuccess(response.data)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    // delete by ID
    function removeOne(id, onSuccess, onError) { // accepting two function as parameters... ,
        return $http.delete('/api/campaigns/' + id)
            .then((response) => { // '.then run function 'onSuccess', once promis is resolved //returns $http. $http is angulars service that allows you to make ajax / xml calls ,  specifically  the .get
                onSuccess(response.data) // send response data back to controller
            })
            .catch((response) => {
                onError(response.data)
            })
    }
}
