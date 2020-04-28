const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const async = require('async');
const config = require('../config');
const User = require('./../models/User')

module.exports = {
  /**
   * Admin Login
   */
  login: (req, res) => {
    User.findOne({
      'email': req.body.email
    }).then((recordfound) => {
      console.log(recordfound)
      if (recordfound !== null) {
       
          //incrypt password
          bcrypt.compare(req.body.password, recordfound.password, function (err, result) {
            if (err) {
              res.json({
                status: 500,
                message: "Server Error!",
                error: true
              })
            } else {
              if (result == true) {
                var token = jwt.sign(req.body, config.secret, {
                  expiresIn: 1440 * 60
                });
                res.json({
                  status: 200,
                  success: true,
                  data: recordfound,
                  token: token,
                  message: 'Enjoy your token!',
                  error: false
                });

              } else {
                res.json({
                  status: 400,
                  message: "Incorrect Password",
                  error: true
                });
              }
            }
          });
        
      } else {
        res.json({
          status: 204,
          message: "Account Not Found!",
          error: true
        });
      }

    }).catch((err) => {
      res.send(err)
    })

  },

  /**
   * 
   * add new user from admin
   */
  addUser: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      var userData = req.body
      async.auto({
        checkEmail: function (callback) {
          User.findOne({
            'email': userData.user_detail.email
          }, (err, response) => {
            if (response != null) {
              callback('Email already Exists!')
            } else {
              callback(null, response);
            }
          })
        },
        passwordHash: ['checkEmail', function (results, callback) {
          bcrypt.hash(userData.user_detail.password, 10, function (err, hashpassword) {
            if (err) {
              callback(err)
            } else {
              callback(null, hashpassword);
            }
          })
        }],
        insertUser: ['passwordHash', function (results, callback) {
          var userDetail = userData.user_detail;
          userDetail.password = results.passwordHash;
          new User(userDetail).save((err, response) => {
            if (err) {
              callback(err)
            } else {
              callback(null, response)
            }
          });
        }],

      }, function (err, results) {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            message: "User added Successfully!"
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  },
  /**
   * User list for admin
   */
  userList: (req, res) => {
    User.find({
      'deleted': '0'
    }, (err, response) => {
      if (err) {
        res.status(400).send({
          status: 400,
          error: true,
          message: err

        })
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          success: true,
          data: response
        })
      }
    })
  },

  /**
   * Get User Profile By Id
   */
  getUserProfileById: (req, res) => {

    User.findById(req.params.id, (err, response) => {
      if (err) {
        res.status(400).send({
          status: 400,
          error: true,
          message: err
        })
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          success: true,
          record: response
        })
      }
    })



  },

  /**
   * Edit User By Id
   */
  editUserById: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      var userData = req.body
      async.auto({
        checkRecord: function (callback) {
          User.findOne({
            "_id": req.params.id
          }, (err, response) => {
            if (response != null) {
              callback(null, response)
            } else {
              callback("No Record Found")
            }
          });
        },
        updateUser: ['checkRecord', function (results, callback) {
          User.updateOne({
            "_id": req.params.id
          }, {
            $set: userData.user_detail
          }, (err, result) => {
            if (err) {
              callback(err)
            } else {
              callback(null, result)
            }
          })
        }]
      }, (err, results) => {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            message: "Record Successfully updated!"
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  },

  /**
   * delete user by Id
   */
  deleteUserById: (req, res) => {
    User.findOne({
      "_id": req.params.id
    }, (err, response) => {
      if (err) {
        res.status(400).send({
          status: 400,
          error: true,
          message: err
        })
      } else {
        if (response != null) {
          User.updateOne({
            "_id": req.params.id
          }, {
            $set: {
              "deleted": '1'
            }
          }, (err, response) => {
            if (err) {
              res.status(400).send({
                status: 400,
                error: true,
                message: err
              })
            } else {
              res.status(200).send({
                status: 200,
                error: false,
                success: true,
                message: "User Deleted Successfully!"
              })
            }
          })
        } else {
          res.status(400).send({
            status: 400,
            error: true,
            message: "No record found for this userId!"
          })
        }
      }
    })
  },

  /**
   * Update User Status by id
   */
  updateUserStatus: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      async.auto({
        findUser: function (callback) {
          User.findOne({
            "_id": req.params.id
          }, (err, response) => {
            if (err) {
              callback(err)
            } else {
              if (response != null) {
                callback(null, response)
              } else {
                callback("No User Found!")
              }

            }
          });
        },
        updateStatus: ['findUser', (results, callback) => {
          User.updateOne({
            "_id": req.params.id
          }, {
            $set: {
              "status": req.body.status
            }
          }, (err, result) => {
            if (err) {
              callback(err)
            } else {
              callback(null, "update")
            }
          })
        }]
      }, (err, results) => {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            message: "Record updated successfully!"
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  },
  /**
   * change password
   */
  changePassword: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      async.auto({
        getUserPassword: function (callback) {
          User.findById(req.decoded._id, (err, response) => {
            if (err) {
              callback(err)
            } else {
              if (response != null) {
                callback(null, response)
              } else {
                callback("No record found!")
              }
            }
          })
        },
        checkOldPassword: ['getUserPassword', function (result, callback) {
          bcrypt.compare(req.body.oldPassword, result.getUserPassword.password, function (err, result) {
            if (result !== true) {
              callback("Password Incorrect!")
            } else {
              callback(null, "true")
            }
          })
        }],
        encryptPassword: ['checkOldPassword', (result, callback) => {
          if (result.checkOldPassword === "true") {
            bcrypt.hash(req.body.password, 10, function (err, hashpassword) {
              if (err) {
                callback(err)
              } else {
                callback(null, hashpassword)
              }
            })
          }
        }],
        insertNewPassword: ['encryptPassword', (result, callback) => {
          User.updateOne({
            "_id": req.decoded._id
          }, {
            $set: {
              "password": result.encryptPassword
            }
          }, (err, result) => {
            if (err) {
              callback(err)
            } else {
              callback(null, "updated")
            }
          })

        }]
      }, (err, results) => {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            message: "Your password has been changed successfully!"
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  },

  /**
   * filter By Name
   */
  search: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      async.auto({
        findUserByName: function (callback) {
          if (req.body.email == '') {
            var query = {
              $and: [{
                $or: [{
                  first_name: {
                    $regex: req.body.name,
                    $options: 'i'
                  }
                }, {
                  last_name: {
                    $regex: req.body.name,
                    $options: 'i'
                  }
                }]
              }, {
                role: 'company user'
              }, {
                deleted: '0'
              }]
            }
          } else {
            if (req.body.name == '') {
              var query = {
                $and: [{
                  email: {
                    $regex: req.body.email,
                    $options: 'i'
                  }
                }, {
                  role: 'company user'
                }, {
                  deleted: '0'
                }]
              }
            } else {
              var query = {
                $and: [{
                  $or: [{
                    first_name: {
                      $regex: req.body.name,
                      $options: 'i'
                    }
                  }, {
                    last_name: {
                      $regex: req.body.name,
                      $options: 'i'
                    }
                  }]
                }, {
                  email: {
                    $regex: req.body.email,
                    $options: 'i'
                  }
                }, {
                  role: 'company user'
                }, {
                  deleted: '0'
                }]
              }
            }

          }
          User.find(query, function (err, user) {
            if (err) {
              callback(err)
            } else {
              callback(null, user)
            }
          });
        }
      }, (err, results) => {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            data: results.findUserByName
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  },

  /**
   * filter By Date
   */
  filterByDate: (req, res) => {
    if (Object.keys(req.body).length > 0) {
      async.auto({
        findUserBydate: function (callback) {
          var moment = require('moment')
          var today = moment(req.body.date).startOf('day')
          var tomorrow = moment(today).endOf('day')
          User.find({
            createdAt: {
              $gte: today.toDate(),
              $lte: tomorrow.toDate()
            }
          }).exec((err, response) => {
            if (err) {
              callback(err)
            } else {
              callback(null, response)
            }
          })
        }
      }, (err, results) => {
        if (err) {
          res.status(400).send({
            status: 400,
            error: true,
            message: err
          })
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            success: true,
            data: results.findUserBydate
          })
        }
      })
    } else {
      res.status(400).send({
        status: 400,
        error: true,
        message: "Request data is empty!"
      })
    }
  }
}