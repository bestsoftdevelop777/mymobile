import os
import sys
import logging
import unittest
from appium import webdriver
import datetime
from datetime import date as create_date
from datetime import timedelta
from timeout_decorator import timeout
from time import sleep
from uuid import uuid4
from dateutil.relativedelta import relativedelta

from mu_tests import MicroUmbrellaAppTest

test_dir = os.path.dirname(os.path.realpath(__file__))
root_dir = os.path.abspath(os.path.join(test_dir, os.pardir))

current_cap = {}

build_type = sys.argv[1]

if (build_type != 'release' and build_type != 'debug'):
    sys.exit()

apk_type = 'app-debug.apk'
if build_type == 'release':
    apk_type = 'app-release.apk'

ipa_type = 'Debug-iphonesimulator'
if build_type == 'release':
    ipa_type = 'Release-iphonesimulator'

android_app_path = os.path.join(
    root_dir, 'android', 'app', 'build', 'outputs', 'apk', apk_type)
ios_app_path = os.path.join(root_dir, 'ios', 'build', 'Build',
                            'Products', ipa_type,
                            'Microsurance.app')

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'

local_caps = {
    # 'android': {
    #     'platformName': 'Android',
    #     'platformVersion': '7.0',
    #     'deviceName': 'Redmi',
    #     'app': android_app_path
    # },
    # 'android': {
    #     'platformName': 'Android',
    #     'platformVersion': '6.0',
    #     'deviceName': 'Redmi',
    #     'app': android_app_path
    # },
    'iPhone 5s': {
        'platformName': 'iOS',
        'platformVersion': '10.3',
        'deviceName': 'iPhone 5s',
        'app': ios_app_path
    }
}

if __name__ == "__main__":
    build_type = sys.argv[1]
    LOCAL_TIMEOUT = 10
    LOAD_TIME_MULTIPLY = 2
    if build_type == 'debug':
        LOAD_TIME_MULTIPLY = 1

MALE_OPTION = 1
FEMALE_OPTION = 2

SPOUSE_OPTION = 1
CHILD_OPTION = 2


class PurchaseTests(MicroUmbrellaAppTest):

    def setUp(self):
        self.driver = webdriver.Remote(
            'http://localhost:4723/wd/hub', current_cap)

    def add_traveller(self, traveller):
        self.tap_on(self.poll_tree_until_found('purchase__add-traveller'))
        first_name_input = self.poll_tree_until_found('table__field-firstName')
        self.tap_on(first_name_input)
        self.driver.set_value(first_name_input, 'Ken')
        self.hide_keyboard()
        last_name_input = self.find_accessibility('table__field-lastName')
        self.tap_on(last_name_input)
        self.driver.set_value(last_name_input, 'Chan')
        self.hide_keyboard()
        nric_input = self.find_accessibility('table__field-idNumber')
        self.tap_on(nric_input)
        self.driver.set_value(nric_input, '999')
        self.hide_keyboard()
        dob_input = self.find_accessibility('table__field-DOB')
        self.tap_on(dob_input)
        sleep(2)
        self.select_date(traveller['dob'])
        self.tap_on(self.poll_tree_until_found('table__field-gender'))
        self.tap_on(self.poll_tree_until_found(
            'picker__option-'+str(MALE_OPTION)))
        self.tap_on(self.poll_tree_until_found('table__field-relationship'))
        self.tap_on(self.poll_tree_until_found(
            'picker__option-'+str(traveller['relationship'])))
        self.tap_on(self.find_accessibility('table__save-btn'))
        self.tap_on(self.poll_tree_until_found('chat__submit-traveller'))

    def get_birth_date(self, age):
        now = datetime.datetime.now()
        birth_date = now - relativedelta(years=age)
        return birth_date

    def test_purchase_travel_applicant(self):
        spouse = {
            'dob': self.get_birth_date(30),
            'relationship': SPOUSE_OPTION
        }
        self.purchase_travel_policy(
            country_name='Macau', country_code=53,
            start_date=create_date(2017, 12, 10),
            duration=17, plan='enhanced', spouse=spouse)

    @timeout(7 * 60)
    def purchase_travel_policy(
            self, country_name, country_code,
            start_date, duration, plan, spouse=None, child=None):
        signin_el = self.poll_tree_until_found('intro__sign-in')
        # signin_el = self.find_accessibility('intro__sign-in')
        self.tap_on(signin_el)
        self.login_user()
        # sleep(2)

        menu_btn = self.poll_tree_until_found('nav__menu-btn')
        self.assertIsNotNone(menu_btn)
        travel_policy_choice = self.poll_tree_until_found(
            'purchase__policy-choice-travel')
        self.tap_on(travel_policy_choice)
        sleep(0.5)
        back_btn = self.find_accessibility('nav__back-btn')
        self.assertIsNotNone(back_btn)
        purchase_btn = self.find_accessibility('policy__purchase-btn')
        self.tap_on(purchase_btn)
        # sleep(3)
        COMPOSER_PLACEHOLDER = 'Type your message here...'
        back_btn = self.poll_tree_until_found('nav__back-btn')
        self.assertIsNotNone(back_btn)

        self.tap_on(self.poll_tree_until_found(plan.upper()+'\nPLAN'))
        self.tap_on(self.find_accessibility('chat__select-plan_'+plan))
        composer = self.poll_tree_until_found(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, country_name)
        sleep(0.5)
        country_suggestion = self.find_accessibility(
            'chat__suggestion-'+str(country_code))
        self.tap_on(country_suggestion)
        # self.add_traveller(spouse)

        self.tap_on(self.poll_tree_until_found('chat__datepicker'))
        sleep(3)
        self.select_date(start_date)
        self.tap_on(self.poll_tree_until_found('chat__datepicker'))
        sleep(3)
        self.select_date(start_date + timedelta(days=duration))
        # sleep(1.5 * LOAD_TIME_MULTIPLY)

        self.tap_on(self.poll_tree_until_found('chat__action-picker'))
        sleep(1)
        self.tap_on(self.find_accessibility('chat__suggestion-passport'))
        sleep(0.5)
        composer = self.find_accessibility(COMPOSER_PLACEHOLDER)
        self.tap_on(composer)
        self.driver.set_value(composer, str(uuid4())[:15])
        self.tap_on(self.find_accessibility('Send'))
        # sleep(1 * LOAD_TIME_MULTIPLY)

        # add traveller
        if spouse:
            self.add_traveller(spouse)
        if child:
            self.add_traveller(child)

        self.tap_on(self.poll_tree_until_found('PROCEED'))
        self.tap_on(self.poll_tree_until_found('policy__purchase-btn'))
        card_number_input = self.poll_tree_until_found(
            'purchase__card-number-input')
        self.tap_on(card_number_input)
        sleep(2)
        self.driver.set_value(card_number_input, '4005550000000001')
        # with open('source.txt', 'w') as f:
        #     f.write(self.driver.page_source)
        expiry_input = self.poll_tree_until_found('purchase__expiry-input')
        # expiry_input = self.find_accessibility('purchase__expiry-input')
        self.tap_on(expiry_input)
        sleep(0.5)
        self.driver.set_value(expiry_input, '0121')
        sleep(0.5)
        cvc_input = self.poll_tree_until_found('purchase__cvc-input')
        self.tap_on(cvc_input)
        sleep(0.5)
        self.driver.set_value(cvc_input, '602')
        sleep(0.5)
        full_name_input = self.poll_tree_until_found(
            'purchase__card-name-input')
        self.tap_on(full_name_input)
        sleep(0.5)
        self.driver.set_value(full_name_input, 'Chan')
        self.hide_keyboard()
        sleep(2)
        self.tap_on(self.find_accessibility('purchase__confirm-purchase-btn'))
        self.tap_on(self.poll_tree_until_found('OK', 20))


if __name__ == '__main__':
    for cap in local_caps:
        current_cap = local_caps[cap]
        logging.basicConfig(stream=sys.stderr)
        logging.getLogger("PurchaseTests").setLevel(logging.DEBUG)
        suite = unittest.TestLoader().loadTestsFromTestCase(PurchaseTests)
        unittest.TextTestRunner(verbosity=2).run(suite)
