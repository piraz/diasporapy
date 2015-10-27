#!/usr/bin/env python
#
# Copyright 2015 Flavio Garcia
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
#
# vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4:


from __future__ import (absolute_import, division, print_function,
                        with_statement)

from diasporapy.services.user import UserService
from diasporapy.services.profile import ProfileService
from diasporapy.services.person import PersonService
from firenado.core import service


class AccountService(service.FirenadoService):

    @service.served_by(UserService)
    @service.served_by(PersonService)
    @service.served_by(ProfileService)
    def register(self, user_name, email, password):
        user = self.user_service.create(user_name, email, password)
        person_data={}
        person_data['user'] = user
        person = self.person_service.create(person_data)
        profile_data={}
        profile_data['person'] = person
        profile = self.profile_service.create(profile_data)