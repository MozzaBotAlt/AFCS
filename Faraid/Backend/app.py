from flask import Flask, render_template
from Backend import Faraid
import json, os, requests
from datetime import *

app = Flask(__name__)
faraid = Faraid.faraid()

print("Copyright (C) 2025  Ali Mozzabot I, This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. ")

@app.route('/')
def home():
  return render_template('index.html')

@app.route('/date')
def date():
    time = datetime.now(timezone.utc)
    print(time)

@app.route('/faraid')
async def code():
  try:
    return await faraid()
    
    except ValueError as e:
      return jsonify({"error": str(e)}), 400
    except Exception as e:
      return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
@app.route("/terminal", methods=["POST"])
def terminal():
    data = request.json["input"]

    # Run command in shell
    try:
        output = subprocess.check_output(data, shell=True, stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        output = e.output

    return output

app.run(host='0.0.0.0', port=3003)

if __name__ == '__main__':
    app.run(debug=True)