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

  // fetch and execute the python modules stored in same directory as this loader script
  // Load in correct dependency order: HeirsDict -> Functions -> Faraid
  const files = ["HeirsDict.py", "Functions.py", "Faraid.py"];
  for (let fname of files) {
    try {
      const res = await fetch(`./${fname}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${fname}: ${res.statusText}`);
      }
      const code = await res.text();
      pyodide.runPython(code);
      console.log(`${fname} loaded successfully`);
    } catch (error) {
      console.error(`Error loading ${fname}:`, error);
      throw error;
    }
  }
  console.log("All Python modules imported");

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
loadPyodideModules().catch(error => {
  console.error("Failed to load Pyodide modules:", error);
  // Show error message to user
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 51, 102, 0.95);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    z-index: 10000;
    text-align: center;
  `;
  errorDiv.innerHTML = `
    <h2>Failed to Load Calculator</h2>
    <p>There was an error loading the calculator. Please refresh the page.</p>
    <p style="font-size: 0.9rem; margin-top: 1rem;">Error: ${error.message}</p>
  `;
  document.body.appendChild(errorDiv);
});
