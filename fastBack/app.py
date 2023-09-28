import hug
from bs4 import BeautifulSoup
import schedule
import time
import requests
from selenium import webdriver 
from selenium.webdriver.common.by import By
import threading
import requests
# import redis

# pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
# redis = redis.Redis(connection_pool=pool)

# redis.set('mykey', 'Hello from Python!')
# value = redis.get('mykey')
# print(value)

# redis.zadd('vehicles', {'car' : 0})
# redis.zadd('vehicles', {'bike' : 0})
# vehicles = redis.zrange('vehicles', 0, -1)
# print(vehicles)

def cors_support(response, *args, **kwargs):
    response.set_header('Access-Control-Allow-Origin', '*')

def getData():
    global dataWithLabel
    dataWithLabel = {}

    option = webdriver.ChromeOptions()
    option.add_argument('headless')
    driver = webdriver.Chrome(options=option)

    threading.Timer(20.0, getData).start()

    driver.get('https://www.worldometers.info/')

    # data = driver.find_elements(By.CLASS_NAME, 'rts-counter')

    # labelData = driver.find_elements(By.CLASS_NAME, 'counter-item')

    # for i,j in enumerate(labelData):
    #     if len(data[i].text) <= 2:
    #         continue
    #     labelOk = j.text.replace(" ", "_").lower()
    #     numberOk = int(data[i].text.replace(",", "")) if data[i].text.replace(",", "") else data[i].text.replace(",", "")
    #     dataWithLabel[labelOk] = numberOk

    fullData = []
    data = []
    counterHeader = []
    counterHeaderData = []

    for i in range(1, 63):
        fullData.append(driver.find_elements(By.ID, 'c'+str(i)))


    for i, j in enumerate(fullData):
        if len(fullData[i]):
            data.append(fullData[i][0].text.split("\n"))

    for i in data:
        label = i[1].replace(" ", "_").lower()
        value = i[0].replace(",", "")
        value = value.replace("$", "")
        value = value.replace(" tons", "")
        value = value.replace(" MWh", "")
        dataWithLabel[label] = int(value)

    counterHeader = driver.find_elements(By.CLASS_NAME, 'counter-header')

    for i, j in enumerate(counterHeader):
        counterHeaderData.append(counterHeader[i].text.split("\n"))

    for i in counterHeaderData:
        label = i[1].replace(" ", "_").lower()
        value = i[0].replace(",", "")
        value = value.replace("$", "")
        value = value.replace(" tons", "")
        value = value.replace(" MWh", "")
        dataWithLabel[label] = int(value)

    driver.quit()
    
    return dataWithLabel

getData()

@hug.get('/', requires=cors_support)
def root():
    return dataWithLabel

@hug.get('/births', requires=cors_support)
def births_this_year():
    if ("births_this_year" in dataWithLabel and "births_today" in dataWithLabel):
        return {"births_this_year" : dataWithLabel["births_this_year"], "births_today" : dataWithLabel["births_today"]}

@hug.get('/deaths', requires=cors_support)
def deaths_this_year():
    if ("deaths_this_year" in dataWithLabel and "deaths_today" in dataWithLabel):
        return {"deaths_this_year" : dataWithLabel["deaths_this_year"], "deaths_today" : dataWithLabel["deaths_today"]}

@hug.get('/abortions', requires=cors_support)
def abortions_this_year():
    if ("abortions_this_year" in dataWithLabel):
        return {"abortions_this_year" : dataWithLabel["abortions_this_year"], "abortions_today" : int(dataWithLabel["abortions_this_year"]/365)}

