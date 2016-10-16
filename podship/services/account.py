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

import datetime
from podship.services.user import UserService
from podship.services.profile import ProfileService
from podship.services.person import PersonService
from firenado import service


class AccountService(service.FirenadoService):

    def __init__(self, handler, data_source=None):
        service.FirenadoService.__init__(self, handler, data_source)

    @service.served_by(UserService)
    @service.served_by(PersonService)
    @service.served_by(ProfileService)
    def register(self, account_data):
        db_session = self.get_data_source(
                'diasporapy').get_connection()['session']
        created_utc = datetime.datetime.utcnow()
        user = self.user_service.create(account_data['user_data'],
                                        created_utc=created_utc,
                                        db_session=db_session)
        person_data = {}
        person_data['user'] = user
        person = self.person_service.create(
            person_data,created_utc=created_utc, db_session=db_session)
        db_session.commit()
        profile_data = {}
        profile_data['person'] = person
        profile = self.profile_service.create(
            profile_data, created_utc=created_utc, db_session=db_session)
        db_session.commit()

    @service.served_by(UserService)
    def is_login_valid(self, login_data):
        db_session = self.get_data_source(
                'diasporapy').get_connection()['session']
        user = self.user_service.get_by_user_name(
            login_data['username'], db_session)
        if user:
            if self.user_service.is_password_valid(
                    login_data['password'], user.encrypted_password):
                return user
        return False
