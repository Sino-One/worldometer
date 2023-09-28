from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import schedule
import time
import requests
from requests_html import HTMLSession, HTMLResponse

app = Flask(__name__)
cors = CORS(app)


# def news(url):
#     response = requests.get(url)
#     soup_object = BeautifulSoup(response.content)
#     data_table = soup_object.find_all('table', 'data-table')[0]
#     print(data_table)

# def check_update(url):
#     response = requests.get(url)
#     soup_object = BeautifulSoup(response.content)
#     data_table = soup_object.find_all('table', 'data-table')[0]
#     print(data_table)

@app.route("/")
async def read_root():
    return {"Hello": "World"}

if __name__ == '__main__':
    # url = 'https://www.worldometers.info/'
    # schedule.every(10).seconds.do(news, url=url)
    # schedule.every(60).seconds.do(check_update, url=url)
    # while True:
        # schedule.run_pending()
        # time.sleep(1)
    app.run(debug=True)