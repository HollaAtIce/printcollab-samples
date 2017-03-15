/* global angular */
angular.module('public.newsletter')
    .controller('NewsletterController', NewsletterController)

NewsletterController.$inject = ['NewsletterService']

function NewsletterController(NewsletterService) {
    var vm = this
    vm.newsletterForm = {
        status: 'subscribed'
    }
    vm.submitForm = _submitForm
    vm.showError = false
    vm.showSuccess = false

    function _submitForm(data) {
        NewsletterService.insertEmail(vm.newsletterForm, onInsertSuccess, onError)
    }

    function onInsertSuccess(memberId) {
        vm.newsletterForm = null
        vm.email = memberId
        vm.showError = false
        vm.showSuccess = true
    }

    function onError() {
        vm.newsletterForm = null
        vm.showError = true
        vm.showSuccess = false
    }
}
