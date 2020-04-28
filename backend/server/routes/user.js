const usercontroller = require('./../controllers/user.ctrl')

module.exports = (router) => {
    function methodNotAllowedHandler(req, res) {
        res.sendStatus(405)
    }
    

    /**
     *admin login
     */
    router
        .route('/login')
        .post(usercontroller.login)
        .all(methodNotAllowedHandler)
   

    /** 
     *  add new user
     */
    router
        .route('/admin/user/add')
        .post(usercontroller.addUser)
        .all(methodNotAllowedHandler)

    /**
     * User list
     */
    router
        .route('/admin/user')
        .get(usercontroller.userList)
        .all(methodNotAllowedHandler)

    /**
     * User detail by id 
     */
    router
        .route('/admin/userprofile/:id')
        .get(usercontroller.getUserProfileById)
        .all(methodNotAllowedHandler)

    /**
     * delete user by Id
     */
    router
        .route('/admin/user/delete/:id')
        .delete(usercontroller.deleteUserById)
        .all(methodNotAllowedHandler)

    /**
     * Edit user By Id
     */
    router
        .route('/admin/user/edit/:id')
        .put(usercontroller.editUserById)
        .all(methodNotAllowedHandler)

    /**
     * Update Status of user
     */
    router
        .route('/admin/user/status/:id')
        .put(usercontroller.updateUserStatus)
        .all(methodNotAllowedHandler)

    /**
     * Filter by Name
     */
    router
        .route('/search')
        .post(usercontroller.search)
        .all(methodNotAllowedHandler)

    /**
     * Filter by Date
     */
    router
        .route('/filterbydate')
        .post(usercontroller.filterByDate)
        .all(methodNotAllowedHandler)


}