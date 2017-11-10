import sys
import os
import unittest
from time import sleep
from appium import webdriver
from appium.webdriver.common.touch_action import TouchAction
from calendar import month_name

LOGIN_EMAIL = 'x@aa.com'
LOGIN_PASSWORD = '1234abcd'


class MicroUmbrellaAppTest(unittest.TestCase):

    def __init__(self, *args):
        super().__init__(*args)

    def tearDown(self):
        self.driver.quit()

    def tap_on(self, el):
        action = TouchAction(self.driver)
        action.tap(el).perform()

    def select_date(self, date):
        self.tap_on(self.find_accessibility('chat__datepicker'))
        sleep(1)
        datepicker = self.driver.find_elements_by_class_name(
            'XCUIElementTypePickerWheel')
        datepicker[0].send_keys(month_name[date.month])
        datepicker[1].send_keys(str(date.day))
        datepicker[2].send_keys(str(date.year))
        self.tap_on(self.find_accessibility('Confirm'))

    def login_user(self, email=LOGIN_EMAIL, password=LOGIN_PASSWORD):
        login_btn = self.find_accessibility('auth__login-btn')
        login_email_input = self.driver.find_elements_by_accessibility_id(
            'Email')[1]  # skip label
        login_password_input = self.driver\
            .find_elements_by_accessibility_id('Password')[1]  # skip label
        self.tap_on(login_email_input)
        self.driver.set_value(login_email_input, email)
        self.tap_on(login_password_input)
        self.driver.set_value(login_password_input, password)
        self.tap_on(login_btn)  # to dismiss keyboard
        self.tap_on(login_btn)

    def check_policies_exist(self):
        policies = ['travel', 'pa', 'pa_mr', 'pa_wi']
        for policy in policies:
            choice_el = self.find_accessibility(
                'purchase__policy-choice-'+policy)
            self.assertIsNotNone(choice_el)

    def signup_user(self):
        sleep(1)
        signin_el = self.find_accessibility('intro__sign-in')
        self.assertIsNotNone(signin_el)
        self.tap_on(signin_el)
        sleep(1)
        go_to_signup = self.find_accessibility('auth__go-to-signup')
        self.assertIsNotNone(go_to_signup)
        self.tap_on(go_to_signup)
        sleep(1)
        signup_btn = self.find_accessibility('SIGN UP')
        signup_email_input = self.find_accessibility('Email')
        signup_password_input = self.find_accessibility(
            'Password')
        signup_telephone_input = self.find_accessibility(
            'Telephone')
        signup_confirm_password_input = self.find_accessibility(
            'Confirm password')
        signup_first_name_input = self.find_accessibility(
            'First name')
        signup_last_name_input = self.find_accessibility(
            'Last name')
        self.driver.set_value(signup_email_input, 'test@gmail.com')
        self.driver.set_value(signup_password_input, '1234abcd')
        self.driver.set_value(signup_confirm_password_input, '1234abcd')
        self.driver.set_value(signup_telephone_input, '8888888')
        self.driver.set_value(signup_first_name_input, '1234abcd')
        self.driver.set_value(signup_last_name_input, '1234abcd')
        self.tap_on(signup_btn)
