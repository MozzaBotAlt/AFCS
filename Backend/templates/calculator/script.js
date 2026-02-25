// ===================================
// AFCS - Faraid Calculator Logic
// ===================================

// Form State Management
const formState = {
  gender: null,
  totalAssets: 0,
  debt: 0,
  funeral: 0,
  will: 0,
  nazar: 0,
  netAsset: 0,
  heirs: {},
  results: null
};

// Heir Mapping
const heirMappings = {
  'son': 'Son',
  'grandson': 'Grandson',
  'father': 'Father',
  'grandfather': 'Grandfather Father Side',
  'brother': 'Brother',
  'stepbrother-father': 'Stepbrother Same Father',
  'stepbrother-mother': 'Stepbrother Same Mother',
  'nephew': 'Nephew',
  'uncle': 'Uncle',
  'cousin': 'Male Cousin',
  'daughter': 'Daughter',
  'granddaughter': 'Granddaughter',
  'mother': 'Mother',
  'grandmother-father': 'Grandmother Father Side',
  'sister': 'Sister',
  'stepsister-father': 'Stepsister Same Father',
  'stepsister-mother': 'Stepsister Same Mother',
  'spouse': 'Wife' // Will change to Husband or Wife based on gender
};

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeFormListeners();
  updateNetAssetPreview();
  setupHeirCheckboxListeners();
  updateProgressTracker();
});

// Initialize all form listeners
function initializeFormListeners() {
  // Net asset calculation listeners
  document.getElementById('total-assets').addEventListener('input', updateNetAssetPreview);
  document.getElementById('debt').addEventListener('input', updateNetAssetPreview);
  document.getElementById('funeral').addEventListener('input', updateNetAssetPreview);
  document.getElementById('will').addEventListener('input', updateNetAssetPreview);
  document.getElementById('nazar').addEventListener('input', updateNetAssetPreview);

  // Gender selection
  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      formState.gender = e.target.value;
    });
  });
}

// Setup heir checkbox listeners
function setupHeirCheckboxListeners() {
  document.querySelectorAll('.heir-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const heirId = e.target.id;
      const countInput = document.getElementById(heirId + '-count');
      const isChecked = e.target.checked;

      if (isChecked) {
        countInput.disabled = false;
        countInput.focus();
        if (!countInput.value) {
          countInput.value = 1;
        }
      } else {
        countInput.disabled = true;
        countInput.value = '';
      }
    });
  });

  // Count input listeners
  document.querySelectorAll('.heir-count').forEach(input => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value && parseInt(value) < 1) {
        e.target.value = 1;
      }
    });
  });
}

// Update net asset preview
function updateNetAssetPreview() {
  const totalAssets = parseFloat(document.getElementById('total-assets').value) || 0;
  const debt = parseFloat(document.getElementById('debt').value) || 0;
  const funeral = parseFloat(document.getElementById('funeral').value) || 0;
  const will = parseFloat(document.getElementById('will').value) || 0;
  const nazar = parseFloat(document.getElementById('nazar').value) || 0;

  const netAsset = totalAssets - debt - funeral - will - nazar;

  formState.totalAssets = totalAssets;
  formState.debt = debt;
  formState.funeral = funeral;
  formState.will = will;
  formState.nazar = nazar;
  formState.netAsset = netAsset;

  const netAssetDisplay = document.getElementById('net-asset-amount');
  if (netAssetDisplay) {
    netAssetDisplay.textContent = netAsset.toFixed(2);
  }
}

// Navigate to next step
function nextStep(currentStep) {
  if (currentStep === 1) {
    if (!validateStep1()) return;
    showStep(2);
  } else if (currentStep === 2) {
    if (!validateStep2()) return;
    calculateInheritance();
    showStep(3);
  }
}

// Navigate to previous step
function previousStep(currentStep) {
  showStep(currentStep - 1);
}

// Show specific step
function showStep(stepNum) {
  // Hide all sections
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show selected section
  document.getElementById(`step-${stepNum}`).classList.add('active');

  // Update progress tracker
  updateProgressTracker(stepNum);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update progress tracker
function updateProgressTracker(activeStep) {
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    if (index + 1 === activeStep) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Validate Step 1
function validateStep1() {
  const gender = document.querySelector('input[name="gender"]:checked');
  const totalAssets = parseFloat(document.getElementById('total-assets').value) || 0;

  if (!gender) {
    showError('Please select the deceased\'s gender');
    return false;
  }

  if (totalAssets <= 0) {
    showError('Please enter a valid total asset value');
    return false;
  }

  if (formState.netAsset <= 0) {
    showError('Net asset must be greater than 0. Check deductions.');
    return false;
  }

  formState.gender = gender.value;
  return true;
}

// Validate Step 2
function validateStep2() {
  const selectedHeirs = document.querySelectorAll('.heir-checkbox:checked');

  if (selectedHeirs.length === 0) {
    showError('Please select at least one heir');
    return false;
  }

  // Validate that each selected heir has a count
  let valid = true;
  selectedHeirs.forEach(heir => {
    const countInput = document.getElementById(heir.id + '-count');
    const count = parseInt(countInput.value) || 0;
    if (count < 1) {
      showError(`Please enter a valid count for ${heir.nextElementSibling.textContent}`);
      valid = false;
    }
  });

  if (!valid) return false;

  // Build heirs data
  formState.heirs = {};
  selectedHeirs.forEach(heir => {
    const countInput = document.getElementById(heir.id + '-count');
    const count = parseInt(countInput.value) || 0;
    const heirName = heirMappings[heir.id];
    formState.heirs[heirName] = count;
  });

  return true;
}

// Calculate inheritance
async function calculateInheritance() {
  try {
    showLoading(true);

    const payload = {
      gender: formState.gender,
      totalAssets: formState.totalAssets,
      debt: formState.debt,
      funeral: formState.funeral,
      will: formState.will,
      nazar: formState.nazar,
      netAsset: formState.netAsset,
      heirs: formState.heirs
    };

    console.log('Sending payload:', payload);

    // Call backend API
    const response = await fetch('/calculate-faraid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Calculation failed');
    }

    const results = await response.json();
    formState.results = results;
    displayResults(results);

    showLoading(false);
  } catch (error) {
    console.error('Error:', error);
    showError('Error calculating inheritance: ' + error.message);
    showLoading(false);
  }
}

// Display results
function displayResults(results) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  // Update net estate display
  document.getElementById('result-net-estate').textContent = 
    `RM ${formState.netAsset.toFixed(2)}`;

  // Display each heir result
  if (results.heirs && Object.keys(results.heirs).length > 0) {
    Object.entries(results.heirs).forEach(([heirName, heirData]) => {
      const heirElement = createHeirResultCard(heirName, heirData);
      resultsContainer.appendChild(heirElement);
    });
  } else {
    resultsContainer.innerHTML = '<p class="error-message">No heir distributions calculated</p>';
  }
}

// Create heir result card
function createHeirResultCard(heirName, heirData) {
  const card = document.createElement('div');
  card.className = 'heir-result';

  const portion = heirData.portion || 'N/A';
  const amount = heirData.amount || 0;
  const count = heirData.count || 1;

  card.innerHTML = `
    <h4>${heirName}</h4>
    <div class="portion">
      <span>Portion:</span>
      <span class="portion-value">${portion}</span>
    </div>
    <div class="portion">
      <span>Count:</span>
      <span class="portion-value">× ${count}</span>
    </div>
    <div class="amount">RM ${amount.toFixed(2)}</div>
  `;

  return card;
}

// Export results as PDF
function exportResults() {
  if (!formState.results) {
    showError('No results to export');
    return;
  }

  // For now, just print the page
  window.print();
}

// Reset form
function resetForm() {
  // Reset form state
  formState.gender = null;
  formState.totalAssets = 0;
  formState.debt = 0;
  formState.funeral = 0;
  formState.will = 0;
  formState.nazar = 0;
  formState.netAsset = 0;
  formState.heirs = {};
  formState.results = null;

  // Reset form inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.value = '';
  });

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });

  document.querySelectorAll('.heir-checkbox').forEach(checkbox => {
    checkbox.checked = false;
    const countInput = document.getElementById(checkbox.id + '-count');
    if (countInput) {
      countInput.disabled = true;
      countInput.value = '';
    }
  });

  // Show step 1
  showStep(1);
  updateNetAssetPreview();
  hideError();
}

// Show error message
function showError(message) {
  let errorDiv = document.getElementById('error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.progress-tracker'));
  }
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message
function hideError() {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

// Show/hide loading
function showLoading(show) {
  let loading = document.getElementById('loading');
  if (!loading && show) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = '<div class="loading"></div> Calculating...';
    loading.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(5, 8, 18, 0.95);
      padding: 2rem;
      border-radius: 12px;
      border: 2px solid #00d9ff33;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #e0e8ff;
    `;
    document.body.appendChild(loading);
  } else if (loading && !show) {
    loading.remove();
  }
}

// Format currency
function formatCurrency(value) {
  return `RM ${parseFloat(value).toFixed(2)}`;
}

// Format fraction
function formatFraction(fraction) {
  if (fraction instanceof Object && fraction.numerator && fraction.denominator) {
    return `${fraction.numerator}/${fraction.denominator}`;
  }
  return String(fraction);
}