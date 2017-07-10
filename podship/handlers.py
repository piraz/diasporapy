#!/usr/bin/env python
#
# Copyright 2015-2017 Flavio Garcia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import firenado.tornadoweb


class LocaleHandler(firenado.tornadoweb.TornadoHandler):
    """ Returns the locale json to be used by the javascript """
    def get(self, lang):
        import tornado.locale
        user_locale = tornado.locale.get("pt")
        # TODO: Add to a service
        locale = {
            "app": {
                "project": "Podship Social Network"
            },
            "common": {
                "password": user_locale.translate("Password"),
                "username": "Username",
                "create": "Create",
                "add": "Add",
                "remove": "Remove",
                "delete": "Clear",
                "cancel": "Cancel",
                "save": "Save",
                "email": "E-mail",
                "search": "Search",
                "login": "Login",
                "register": "Register",
                "logged": "Logged in as <a href='/login' class='navbar-link'>$t(common.username)</a>"
            },
            "layout": {}
        }
        self.write(locale)
