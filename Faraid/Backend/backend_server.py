from flask import Flask, render_template
from Backend import Faraid
import json, os, requests
from datetime import *

app = Flask(__name__)
faraid = Faraid.faraid()

@app.route('/')
def home():
  return "Server OK"

@app.route('/date')
def date():
    time = datetime.now(timezone.utc)
    print(time)

app.run(host='0.0.0.0', port=3000)

if __name__ == '__main__':
    app.run(debug=True)