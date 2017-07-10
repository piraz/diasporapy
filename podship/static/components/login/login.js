/**
 * Copyright 2015-2017 Flavio Garcia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

steal("can-jquery","can-component", "can-connect", "can-connect/constructor",
    "can-connect/data/url", "can-define/map", "can-define/list", "can-deparam",
    "can-event", "can-set/src/set.js", "can-stache", "./login_form.stache",
    function($, Component, connect, constructor, dataUrl, DefineMap,
             DefineList, can_deparam, can_event, set, Stache, template) {
    // var LoginModel = Model.extend({
    //     create : "POST /user/login"
    // },{});
    var loginConnection = connect([constructor, dataUrl], {
        url: {
            getData: "POST /login"
        }
    });

    var LoginViewModel = DefineMap.extend("LoginViewModel", {
        error: "boolean",
        errorMessage: "string",
        userNameError: "boolean",
        passwordError: "boolean",
        processLogin: function (login) {
            window.location = login.next_url;
        },
        processLoginError: function (response) {
            var errorMessage = '';
            if (response.responseJSON.errors.hasOwnProperty('username')) {
                this.attr('userNameError', true);
            }
            if (response.responseJSON.errors.hasOwnProperty('password')) {
                this.attr('passwordError', true);
            }
            var errors = new can.Map(response.responseJSON.errors);
            errors.each(
                function (element, index, list) {
                    if (!this.attr('error')) {
                        this.attr('error', true);
                    }
                    errorMessage += element[0] + '<br>';
                }.bind(this)
            );
            this.attr('errorMessage', errorMessage);
        }
    });

    Component.extend({
        tag: "pod-login",
        view: template,
        ViewModel: LoginViewModel.extend({
            error: {value: false},
            errorMessage: {value: ""},
            userNameError: {value: false},
            passwordError: {value: false}
        }),
        events: {
            "#login_button click": function() {
                this.viewModel.error = false;
                this.viewModel.errorMessage = "";
                this.viewModel.userNameError = false;
                this.viewModel.passwordError = false;

                var form = $(this.element).find("form");
                var values = can_deparam(form.serialize());
                var parameters = [];
                //values._xsrf = getCookie('_xsrf');
                loginConnection.get(values).then(function(response){
                    console.debug(response);
                }, function(reason){
                    console.debug(reason);
                    var data = $.parseJSON(reason.response)
                    console.debug(data);
                });
                // this.viewModel.login.attr(values).save(
                //     this.viewModel.processLogin.bind(this),
                //     this.viewModel.processLoginError.bind(this)
                // );
            }
        }
    });

    $("#podLogin").html(Stache("<pod-login></pod-login>")());
});
