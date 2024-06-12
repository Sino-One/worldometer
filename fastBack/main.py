import json
import threading
import time
from bs4 import BeautifulSoup
import hug
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configure Selenium WebDriver (headless mode)
options = webdriver.ChromeOptions()
options.add_argument('headless')
driver = webdriver.Chrome(options=options)

# URL de la page à scraper
url = "https://www.worldometers.info/"

data = {}

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

# Définir une fonction pour récupérer un élément en traitant les erreurs StaleElementReferenceException
def get_element_safe(driver, locator):
    MAX_RETRIES = 3
    retries = 0
    while retries < MAX_RETRIES:
        try:
            element = driver.find_element(*locator)
            return element
        except StaleElementReferenceException:
            retries += 1
    raise StaleElementReferenceException("Impossible de récupérer l'élément après plusieurs tentatives.")

# Fonction pour récupérer les données à partir de la page Web
def scrape_data():
    try:
        # Charger la page Web
        driver.get(url)
        
        # Attendre que les compteurs soient visibles
        wait = WebDriverWait(driver, 10)
        wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'content-home')))
        
        # Parser le contenu HTML de la page
        soup = BeautifulSoup(driver.page_source, "html.parser")
        # Extraire les compteurs à partir du contenu HTML
        counters = soup.find_all("div", class_="counter-group")
        counters.extend(soup.find_all("div", class_="counter-header"))
        global data
        for counter in counters:
            try:
                item = counter.find("span", class_="counter-item")
                counter_value = counter.find("span", class_="rts-counter")
                if item and counter_value:
                    key = item.text.strip().replace(" ", "_").lower()
                    value = counter_value.text.strip().replace(",", "")
                    data[key] = value
            except Exception as e:
                print(f"Une erreur s'est produite: {e}")
        # Convertir les données en JSON
        json_data = json.dumps(data, indent=4)
        # Afficher le JSON
        print(json_data)
    except Exception as e:
        print(f"Une erreur s'est produite: {e}")
    scrape_other_data()


def scrape_other_data():
    try:
        # Charger la page Web
        driver.get(url)
        
        # Attendre que les compteurs soient visibles
        wait = WebDriverWait(driver, 10)
        wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'content-home')))

        switchElements = driver.find_elements(By.CLASS_NAME, 'settype')

        for i, j in enumerate(switchElements):
            driver.execute_script("arguments[0].scrollIntoView();", switchElements[i])
            driver.execute_script("arguments[0].click();", switchElements[i])
        
        # Parser le contenu HTML de la page
        soup = BeautifulSoup(driver.page_source, "html.parser")
        # Extraire les compteurs à partir du contenu HTML
        counters = soup.find_all("div", class_="counter-group")
        counters.extend(soup.find_all("div", class_="counter-header"))
        for counter in counters:
            try:
                item = counter.find("span", class_="counter-item")
                counter_value = counter.find("span", class_="rts-counter")
                if item and counter_value:
                    key = item.text.strip().replace(" ", "_").lower()
                    value = counter_value.text.strip().replace(",", "")
                    data[key] = value
            except Exception as e:
                print(f"Une erreur s'est produite: {e}")
        # Convertir les données en JSON
        json_data = json.dumps(data, indent=4)
        # Afficher le JSON
        print(json_data)
    except Exception as e:
        print(f"Une erreur s'est produite: {e}")

# Exécuter la fonction de récupération des données toutes les 10 secondes
def run_thread():
    threading.Timer(10.0, run_thread).start()    
    scrape_data()

run_thread()

@hug.get('/', requires=cors_support)
def root():
    return data

@hug.get('/births', requires=cors_support)
def births():
    if ("births_this_year" in data and "births_today" in data):
        return {"births_this_year" : data["births_this_year"], "births_today" : data["births_today"]}

@hug.get('/deaths', requires=cors_support)
def deaths():
    if ("deaths_this_year" in data and "deaths_today" in data):
        return {"deaths_this_year" : data["deaths_this_year"], "deaths_today" : data["deaths_today"]}

@hug.get('/abortions', requires=cors_support)
def abortions():
    if ("abortions_this_year" in data):
        return {"abortions_this_year" : data["abortions_this_year"], "abortions_today" : data["abortions_today"]}

@hug.get('/computers', requires=cors_support)
def computers():
    if ("computers_produced_today" in data):
        return {"computers_produced_today" : data["computers_produced_today"], "computers_produced_this_year" : data["computers_produced_this_year"]}

@hug.get('/cellular', requires=cors_support)
def computers():
    if ("cellular_phones_sold_this_year" in data):
        return {"cellular_phones_sold_this_year" : data["cellular_phones_sold_this_year"], "cellular_phones_sold_today" : data["cellular_phones_sold_today"]}