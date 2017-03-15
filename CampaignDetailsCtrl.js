// ctrl for the campaign details/progress page. included chart.js for doughnut on progress bar and neat color changes when %goal met

/* global angular moment */
'use strict'

angular.module('app.campaigns')
    .controller('CampaignDetailsController', CampaignDetailsController)

CampaignDetailsController.$inject = ['CampaignsService', '$controller', '$state']

function CampaignDetailsController(CampaignsService, $controller, $state) {
    var vm = this
    vm.getCampaignById = _getCampaignById
    vm.id = $state.params.id
    vm.campaigns = []
    vm.newCampaign = {}
    vm.showTable = $state.current.data.showTable
    vm.donutcolors = ['#ff0000', '#717984']
    if (vm.id) {
        _getCampaignById()
    }

    vm.myHeader = {
        'color': 'black',
        'font-size': '30px',
        'font-weight': 'bold'
    }

    vm.myThreeBottoms = {
        'font-weight': 'bold',
        'font-size': '15px'
    }

    vm.prettyUpNumbers = {
        'font-size': '21px',
        'font-weight': 'bold',
        'color': 'white',
        'background-color': '#d3a625',
        'box-shadow': '10px 10px 5px #999999'

    }

    vm.prettyUpNumbers2 = {
        'font-size': '21px',
        'font-weight': 'bold',
        'color': 'white',
        'background-color': '#4d7f17',
        'box-shadow': '10px 10px 5px #999999'
    }

    function _getCampaignById() {
        CampaignsService.getOne(vm.id, onGetOneSuccess, onError)
    }

    function onGetOneSuccess(data) {
        vm.newCampaign = data.item
        vm.date1 = moment(data.item.created_at)
        vm.date2 = moment(data.item.expiration_date)
        vm.dateDifference = moment(data.item.expiration_date).fromNow(true)
        CampaignsService.getCountByCampaignId(vm.newCampaign._id, onOrderCountSuccess, onError)
    }

    function onOrderCountSuccess(data) {
        var orderCount = 0
        for (var i = 0; i < data.items.length; i++) {
            orderCount = orderCount + data.items[i].quantity
        }
        vm.labels = ['Orders Sold', 'Orders left to Goal']
        vm.donutdata = [orderCount, vm.newCampaign.target_orders - orderCount]
        if (orderCount / vm.newCampaign.target_orders <= 0.25) {
            vm.donutcolors[0] = '#800020'
        } else if (orderCount / vm.newCampaign.target_orders <= 0.50) {
            vm.donutcolors[0] = '#3498DB'
        } else if (orderCount / vm.newCampaign.target_orders <= 0.75) {
            vm.donutcolors[0] = '#FFD700'
        } else if (orderCount / vm.newCampaign.target_orders <= 1.0) {
            vm.donutcolors[0] = '#4d7f17'
        } else {
            vm.donutcolors[0] = '#FF69B4'
            vm.donutcolors[1] = '#FF69B4'
        }
    }

    function onError(err) {
        console.log(err)
    }
}
