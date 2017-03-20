/* global angular */
'use strict'

angular.module('app.blog')
    .controller('BlogFormController', BlogFormController)

BlogFormController.$inject = ['BlogService', '$controller', '$state', 'tagService', '$scope', 'UploadsService', 'FileUploader']

function BlogFormController(BlogService, $controller, $state, tagService, $scope, UploadsService, FileUploader) {
    var vm = this
    $controller('baseController', {
        vm: vm
    })

    vm.submitBlogForm = submitBlogForm
    vm.blogForm = null
    vm.blogs = []
    vm.newBlog = {}
    vm.formAction = formAction
    vm.id = $state.params.id
    vm.removeBlogById = removeBlogById
    vm.index = null
    vm.cancelForm = cancelForm
    vm.uploadSuccess = false

    if (vm.id) {
        getBlogById()
    }

    vm.croppieOpts = {
        width: 400,
        height: 400,
        cropheight: 400,
        cropwidth: 320,
        picker: true,
        ratios: [{
            x: 1,
            y: 1
        },
        {
            x: 4,
            y: 6
        },
        {
            x: 8,
            y: 10
        },
        {
            x: 11,
            y: 14
        },
        {
            x: 24,
            y: 36
        },
        {
            x: 27,
            y: 41
        }
        ],
        save: false,
        saveFunction: function(img) {
            Upload.addToQueue(img)
        }
    }

    var Upload = new FileUploader()
    vm.Upload = Upload
    Upload.autoUpload = true
    Upload.removeAfterUpload = true
    Upload.onSuccessItem = function(item, response, status, headers) {
        // Find new URL, save old one, and submit
        var url = item.url.slice(0, item.url.indexOf('?AWS'))
        var oldUrl = vm.newBlog.picture || null
        vm.newBlog.picture = url

        // Delete old image if this is an update.
        if (oldUrl) {
            let key = oldUrl.slice(oldUrl.lastIndexOf('/') + 1)
            UploadsService.remove(key, () => null, () => null)
        }
        vm.uploadSuccess = true
    }

    function formAction() {
        console.log('image submitted')
        if (vm.croppieOpts.c._originalImageHeight) {
            return vm.croppieOpts.getCropped()
        }

        vm.alert({
            type: 'danger'
        }, 'You must select an image!')
    }

    function submitBlogForm(isValid) {
        if (isValid) {
            if (vm.id) {
                BlogService.updateOne(vm.id, vm.newBlog, onUpdateSuccess, onError)
            } else {
                BlogService.insert(vm.newBlog, onInsertSuccess, onError)
            }
        } else {
            console.log('form submitted with invalid data')
        }
    }

    function onUpdateSuccess() {
        vm.alert('success', 'Blog saved!')
        vm.newBlog = null
        $state.go('app.blogs.list')
    }

    function onInsertSuccess(data) {
        vm.alert(data.alert, 'Blog saved!')
        vm.blogs.push(data.item)
        vm.newBlog = {}
        $state.go('app.blogs.list')
    }

    function getBlogById() {
        BlogService.getOne(vm.id, onGetOneSuccess, onError)
    }

    function onGetOneSuccess(data) {
        vm.newBlog = data.item
        vm.croppieOpts.setImage(vm.newBlog.picture)
    }

    if (vm.newBlog.picture) {
        vm.croppieOpts._getDataUri(vm.newBlog.picture, function(dataUrl) {
            vm.croppieOpts.c.bind({
                url: dataUrl
            })
        })
        let ratio = vm.newBlog.options.size
        vm.croppieOpts.setViewport({
            x: ratio.slice(0, ratio.indexOf('x')),
            y: ratio.slice(ratio.indexOf('x') + 1)
        })
    }

    function cancelForm() {
        vm.newBlog = null
        $state.go('app.blogs.list')
    }

    function onError(err) {
        console.log(err)
    }

    function removeBlogById(idx, id) {
        vm.blogToDelete = idx
        BlogService.removeOne(id, onDeleteSuccess, onError)
    }

    function onDeleteSuccess(data) {
        vm.alert(data.alert, 'Blog deleted')
        vm.blogs.splice(vm.blogToDelete, 1)
    }
}
