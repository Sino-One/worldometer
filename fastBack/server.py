from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import hug
import threading
import time



# Configure Selenium WebDriver (headless mode)
options = webdriver.ChromeOptions()
options.add_argument('headless')
driver = webdriver.Chrome(options=options)

# URL de la page à scraper
url = "https://www.worldometers.info/"

# Ouvrir la page Web
driver.get(url)

# Attendre que les éléments soient présents
wait = WebDriverWait(driver, 10)

# Scraper les données spécifiques
data = {}

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

# Fonction pour scraper les compteurs
def scrape_counter(xpath, key):
    try:
        element = wait.until(EC.visibility_of_element_located((By.XPATH, xpath)))
        value = element.text.replace(",", "")
        data[key] = value
    except Exception as e:
        print(f"Erreur lors du scraping de {key}: {e}")
    

# Scraper les différents compteurs
def load_data():
    scrape_counter("//span[@class='rts-counter' and @rel='current_population']", "current_world_population")
    scrape_counter("//span[@class='rts-counter' and @rel='births_this_year']", "births_this_year")
    scrape_counter("//span[@class='rts-counter' and @rel='births_today']", "births_today")
    scrape_counter("//span[@class='rts-counter' and @rel='dth1s_this_year']", "deaths_this_year")
    scrape_counter("//span[@class='rts-counter' and @rel='dth1s_today']", "deaths_today")
    scrape_counter("//span[@class='rts-counter' and @rel='absolute_growth_year']", "Net_population_growth_this_year")
    # Convertir les données en JSON
    json_data = json.dumps(data, indent=4)

    # Afficher le JSON
    print(json_data)
    threading.Timer(10.0, load_data).start()



load_data()


@hug.get('/', requires=cors_support)
def root():
    return data
