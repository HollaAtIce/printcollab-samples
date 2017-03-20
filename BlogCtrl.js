/* global angular */
'use strict' // requiring to use var in front of variable names.

angular.module('app.blog')
    .controller('BlogController', BlogController)

BlogController.$inject = ['BlogService', '$controller', '$state', 'tagService']

function BlogController(BlogService, $controller, $state, tagService) {
    var vm = this
    $controller('baseController', {
        vm: vm
    })
    vm.tagline = '****ADMIN SIDE BLOG/TAGS PAGE****'
    vm.blogs = []
    vm.picture_prefix = 'https://s3-us-west-2.amazonaws.com/sabio-training/C26/'
    vm.deleteBlog = _deleteBlog
    vm.newBlog = null
    vm.tag = $state.params.tag
    vm.tagsByBlogs = []
    if ($state.params.tag) {
        BlogService.getBlogByTagId($state.params.tag, onTagsSuccess, onError)
    } else {
        getAllBlogs()
    }

    function getAllBlogs() {
        BlogService.getAll(getAllSuccess, onError)
    }

    function getAllSuccess(data) {
        vm.blogs = data.items
    }

    function onTagsSuccess(tag) {
        vm.blogs = tag.items
    }

    function onError(err) {
        console.log(err)
    }

    function _deleteBlog(index, id) {
        vm.currentBlog = index
        BlogService.removeOne(id, deleteSuccess, onError)
    }

    function deleteSuccess(data) {
        vm.blogs.splice(vm.currentBlog, 1)
    }
}
