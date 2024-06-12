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
        global data
        for counter in counters:
            item = counter.find("span", class_="counter-item")
            counter_value = counter.find("span", class_="rts-counter")
            if item and counter_value:
                key = item.text.strip()
                value = counter_value.text.strip().replace(",", "")
                data[key] = value
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
        for counter in counters:
            item = counter.find("span", class_="counter-item")
            counter_value = counter.find("span", class_="rts-counter")
            if item and counter_value:
                key = item.text.strip()
                value = counter_value.text.strip().replace(",", "")
                data[key] = value
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
    if ("Births this year" in data and "Births today" in data):
        return {"Births this year" : data["Births this year"], "Births today" : data["Births today"]}

@hug.get('/deaths', requires=cors_support)
def deaths():
    if ("Deaths this year" in data and "Deaths today" in data):
        return {"Deaths this year" : data["Deaths this year"], "Deaths today" : data["Deaths today"]}

@hug.get('/abortions', requires=cors_support)
def abortions():
    if ("Abortions this year" in data):
        return {"Abortions this year" : data["Abortions this year"], "Abortions today" : int(data["Abortions this year"]/365)}

@hug.get('/computers', requires=cors_support)
def computers():
    if ("Computers produced today" in data):
        return {"Computers produced today" : data["Computers produced today"], "Computers produced this year" : int(data["Computers produced this year"])}

@hug.get('/cellular', requires=cors_support)
def computers():
    if ("Cellular phones sold this year" in data):
        return {"Cellular phones sold this year" : data["Cellular phones sold this year"], "Cellular phones sold today" : int(data["Cellular phones sold today"])}