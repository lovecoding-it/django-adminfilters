import pytest
from selenium.webdriver.common.by import By

from demo.management.commands.init_demo import sample_data


@pytest.fixture
def data():
    from demo.factories import ArtistFactory
    ArtistFactory.create_batch(20)
    sample_data()


@pytest.mark.selenium
def test_querystring(live_server, selenium, data):
    from demo.utils import wait_for
    textarea, negate, button = None, None, None

    def submit():
        nonlocal textarea, negate, button
        if button:
            button.click()
        textarea = wait_for(selenium, By.CSS_SELECTOR, "textarea.filter-querystring.qs")
        button = selenium.find_element(By.CSS_SELECTOR, "a.filter-querystring.adminfilters.button.qs")
        negate = selenium.find_element(By.CSS_SELECTOR, "input.filter-querystring.negate.qs")

    selenium.get(f'{live_server.url}/')
    dim = selenium.get_window_size()
    selenium.set_window_size(1100, dim['height'])

    wait_for(selenium, By.LINK_TEXT, 'Artists').click()
    textarea = wait_for(selenium, By.CSS_SELECTOR, "textarea.filter-querystring.qs")
    button = selenium.find_element(By.CSS_SELECTOR, "a.filter-querystring.adminfilters.button.qs")
    negate = selenium.find_element(By.CSS_SELECTOR, "input.filter-querystring.negate.qs")

    textarea.send_keys('name=Angus')
    submit()

    negate.click()
    submit()
    textarea.send_keys('bands__name=AC/DC')
    assert "Phil Rudd" in selenium.page_source

    negate.click()
    textarea.clear()
    textarea.send_keys('bands__name=AC/DC\n!country__name=Australia')
    submit()
    assert "Phil Rudd" not in selenium.page_source
