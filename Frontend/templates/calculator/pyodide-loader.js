// pyodide-loader.js
// loads Pyodide and the Python modules, exposes calculateFaraid(payload)

async function loadPyodideModules() {
  console.log("Loading Pyodide...");
  // use official CDN; version may be updated
  const pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
  });
  window.pyodide = pyodide;
  console.log("Pyodide loaded");

  // fetch and execute the python modules stored in /python
  const files = ["Faraid.py", "HeirsDict.py", "Functions.py"];
  // fetch from same directory as this loader script
  for (let fname of files) {
    const res = await fetch(`./${fname}`);
    const code = await res.text();
    pyodide.runPython(code);
  }
  console.log("Python modules imported");

  // expose async caller for the calculation
  window.calculateFaraid = async function(payload) {
    // payload is JS object with keys matching python calculate_faraid_api
    const jsonPayload = JSON.stringify(payload);
    const code = `
import json
from Faraid import calculate_faraid_api

_payload = json.loads('''${jsonPayload}''')
result = calculate_faraid_api(
    gender=_payload['gender'],
    total_assets=_payload['totalAssets'],
    debt=_payload.get('debt', 0),
    funeral=_payload.get('funeral', 0),
    will=_payload.get('will', 0),
    nazar=_payload.get('nazar', 0),
    net_asset=_payload['netAsset'],
    heirs=_payload['heirs']
)
import json
json.dumps(result)
`;
    const out = await pyodide.runPythonAsync(code);
    return JSON.parse(out);
  };
  console.log("calculateFaraid function available");
}

// begin loading when script is parsed
loadPyodideModules().catch(console.error);
