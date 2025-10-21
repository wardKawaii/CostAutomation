// App.js - All functions and scripts for the costing system
import * as XLSX from 'xlsx';

// ========================
// EXCEL FILE READING FUNCTIONS
// ========================

/**
 * Read Excel file and convert to JSON
 * @param {File} file - The Excel file to read
 * @returns {Promise} - Promise that resolves with the workbook data
 */
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse Beanie Template Excel file
 * @param {Object} workbook - XLSX workbook object
 * @returns {Object} - Parsed data organized by sections
 */
export const parseBeanieExcel = (workbook) => {
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  const parsedData = {
    customerInfo: {},
    yarn: [],
    fabric: [],
    trim: [],
    knitting: [],
    operations: [],
    packaging: [],
    overhead: [],
    notes: ''
  };

  let currentSection = '';
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim().toUpperCase();
    const fifthCell = String(row[4] || '').trim();
    
    // Debug logging for overhead section
    if (firstCell.includes('OVERHEAD') || firstCell === 'PROFIT' || firstCell === 'OVERHEAD') {
      console.log(`Row ${i}: firstCell="${firstCell}", row[3]="${row[3]}", currentSection will be set to overhead`);
    }
    
    // Parse customer information from right side (columns E-F)
    if (fifthCell === 'Customer:' && row[5]) {
      parsedData.customerInfo.customer = String(row[5]).trim();
    }
    if (fifthCell === 'Season:' && row[5]) {
      parsedData.customerInfo.season = String(row[5]).trim();
    }
    if (fifthCell === 'Style#:' && row[5]) {
      parsedData.customerInfo.styleNumber = String(row[5]).trim();
    }
    if (fifthCell === 'Style Name:' && row[5]) {
      parsedData.customerInfo.styleName = String(row[5]).trim();
    }
    if (fifthCell === 'Costed Quantity:' && row[5]) {
      parsedData.customerInfo.costedQuantity = String(row[5]).trim();
    }
    if (fifthCell === 'Leadtime:' && row[5]) {
      parsedData.customerInfo.leadtime = String(row[5]).trim();
    }
    
    // Detect sections - check for exact matches first
    if (firstCell === 'YARN') {
      currentSection = 'yarn';
      continue;
    } else if (firstCell === 'FABRIC') {
      currentSection = 'fabric';
      continue;
    } else if (firstCell === 'TRIM') {
      currentSection = 'trim';
      continue;
    } else if (firstCell === 'KNITTING') {
      currentSection = 'knitting';
      continue;
    } else if (firstCell === 'OPERATIONS') {
      currentSection = 'operations';
      continue;
    } else if (firstCell === 'PACKAGING') {
      currentSection = 'packaging';
      continue;
    } else if (firstCell === 'OVERHEAD/PROFIT' || firstCell === 'OVERHEAD' || firstCell === 'PROFIT') {
      currentSection = 'overhead';
      continue;
    }
    
    // Skip header rows and total rows - be more specific
    // BUT: Don't skip if we're in overhead section and it's "OVERHEAD" or "PROFIT" (actual data rows)
    const isOverheadDataRow = (currentSection === 'overhead' && (firstCell === 'OVERHEAD' || firstCell === 'PROFIT'));
    
    if (!isOverheadDataRow && (
        firstCell.includes('SUB TOTAL') || 
        firstCell.includes('TOTAL MATERIAL') ||
        firstCell.includes('TOTAL FACTORY') ||
        firstCell.includes('CONSUMPTION') || 
        firstCell.includes('MATERIAL PRICE') ||
        firstCell.includes('KNITTING TIME') || 
        firstCell.includes('KNITTING SAM') ||
        firstCell.includes('KNITTING COST') ||
        firstCell.includes('OPERATION TIME') || 
        firstCell.includes('OPERATION COST') ||
        firstCell.includes('FACTORY NOTES') ||
        firstCell.includes('KNITTING SAH') || 
        (firstCell.includes('KNITTING') && firstCell !== 'KNITTING') ||
        firstCell === '')) {
      continue;
    }
    
    // Parse data rows based on current section
    if (currentSection && firstCell) {
      let consumption = 0;
      let price = 0;
      let cost = 0;
      let shouldAdd = false;
      
      // Different sections have different column layouts
      if (currentSection === 'yarn' || currentSection === 'fabric') {
        // For yarn/fabric: col B = consumption, col C = price, col D = cost
        consumption = parseFloat(row[1]) || 0;
        price = parseFloat(row[2]) || 0;
        cost = consumption * price;
        // Only add if BOTH consumption AND price exist
        shouldAdd = consumption > 0 && price > 0;
      } else if (currentSection === 'trim') {
        // For trim: col A = description, col D = cost (no consumption/price)
        const costValue = parseFloat(row[3]) || 0;
        consumption = 1;
        price = costValue;
        cost = costValue;
        // Add if description exists (even if cost is 0)
        shouldAdd = true;
      } else if (currentSection === 'knitting') {
        // For knitting: col B = time, col C = SAM (price per minute), col D = cost
        consumption = parseFloat(row[1]) || 0;
        price = parseFloat(row[2]) || 0;
        cost = consumption * price;
        // Only add if BOTH time AND SAM exist
        shouldAdd = consumption > 0 && price > 0;
      } else if (currentSection === 'operations') {
        // For operations: col A = description, col D = cost
        const costValue = parseFloat(row[3]) || 0;
        consumption = 1;
        price = costValue;
        cost = costValue;
        // Add if description exists (even if cost is 0)
        shouldAdd = true;
      } else if (currentSection === 'packaging' || currentSection === 'overhead') {
        // For packaging/overhead: col A = description, col D = cost
        const costValue = parseFloat(row[3]) || 0;
        consumption = 1;
        price = costValue;
        cost = costValue;
        // Add if description exists (even if cost is 0)
        shouldAdd = true;
      }
      
      const rowData = {
        description: String(row[0] || '').trim(),
        consumption: consumption,
        price: price,
        cost: Math.round(cost * 100) / 100 // Round to 2 decimals
      };
      
      // Only add if there's actual data and description
      if (rowData.description && shouldAdd) {
        parsedData[currentSection].push(rowData);
      }
    }
  }
  
  console.log('Parsed Beanie Data:', parsedData);
  return parsedData;
};

/**
 * Parse BallCaps Template Excel file
 * @param {Object} workbook - XLSX workbook object
 * @returns {Object} - Parsed data organized by sections
 */
export const parseBallCapsExcel = (workbook) => {
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  const parsedData = {
    customerInfo: {},
    fabrics: [],
    otherFabrics: [],
    trims: [],
    operations: [],
    packaging: [],
    overhead: [],
    notes: ''
  };

  let currentSection = '';
  
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim().toUpperCase();
    
    // Detect sections
    if (firstCell === 'FABRICS') {
      currentSection = 'fabrics';
      continue;
    } else if (firstCell.includes('OTHER FABRICS')) {
      currentSection = 'otherFabrics';
      continue;
    } else if (firstCell === 'TRIM/S' || firstCell === 'TRIMS') {
      currentSection = 'trims';
      continue;
    } else if (firstCell === 'OPERATIONS') {
      currentSection = 'operations';
      continue;
    } else if (firstCell === 'PACKAGING') {
      currentSection = 'packaging';
      continue;
    } else if (firstCell.includes('OVERHEAD') || firstCell === 'PROFIT') {
      currentSection = 'overhead';
      continue;
    }
    
    // Skip header rows and total rows
    if (firstCell.includes('SUB TOTAL') || firstCell.includes('TOTAL') || 
        firstCell.includes('CONSUMPTION') || firstCell.includes('MATERIAL PRICE') ||
        firstCell.includes('SAM') || firstCell.includes('FACTORY NOTES') ||
        firstCell === '') {
      continue;
    }
    
    // Parse customer information
    if (row[4] === 'Customer:' && row[5]) {
      parsedData.customerInfo.customer = String(row[5]).trim();
    }
    if (row[4] === 'Season:' && row[5]) {
      parsedData.customerInfo.season = String(row[5]).trim();
    }
    if (row[4] === 'Style#:' && row[5]) {
      parsedData.customerInfo.styleNumber = String(row[5]).trim();
    }
    if (row[4] === 'Style Name:' && row[5]) {
      parsedData.customerInfo.styleName = String(row[5]).trim();
    }
    if (row[4] === 'MOQ:' && row[5]) {
      parsedData.customerInfo.moq = String(row[5]).trim();
    }
    if (row[4] === 'Leadtime:' && row[5]) {
      parsedData.customerInfo.leadtime = String(row[5]).trim();
    }
    
    // Parse data rows
    if (currentSection && firstCell && !firstCell.includes('SUB') && !firstCell.includes('TOTAL')) {
      const consumption = parseFloat(row[1]) || 0;
      const price = parseFloat(row[2]) || 0;
      const cost = consumption * price; // Calculate cost automatically
      
      const rowData = {
        description: String(row[0] || '').trim(),
        consumption: consumption,
        price: price,
        cost: Math.round(cost * 100) / 100 // Round to 2 decimals
      };
      
      if (rowData.description || rowData.consumption || rowData.price) {
        parsedData[currentSection].push(rowData);
      }
    }
  }
  
  return parsedData;
};

// ========================
// DRAG & DROP FUNCTIONS
// ========================

/**
 * Handle drag over event
 * @param {Event} e - Drag event
 */
export const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
};

/**
 * Handle drag enter event
 * @param {Event} e - Drag event
 */
export const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
};

/**
 * Handle drag leave event
 * @param {Event} e - Drag event
 */
export const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Handle file drop event
 * @param {Event} e - Drop event
 * @param {Function} callback - Callback function with file
 */
export const handleDrop = (e, callback) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
  
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
      'text/csv' // .csv
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'xlsm', 'csv'];
    
    if (validTypes.includes(file.type) || validExtensions.includes(fileExtension)) {
      callback(file);
    } else {
      alert('Please drop a valid Excel file (.xlsx, .xls, .xlsm) or CSV file');
    }
  }
};

/**
 * Handle file input change
 * @param {Event} e - Change event
 * @param {Function} callback - Callback function with file
 */
export const handleFileInput = (e, callback) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    callback(file);
  }
};

// ========================
// CALCULATION FUNCTIONS
// ========================

/**
 * Calculate material cost
 * @param {number} consumption - Consumption amount
 * @param {number} price - Price per unit
 * @returns {number} - Calculated cost
 */
export const calculateMaterialCost = (consumption, price) => {
  const result = (parseFloat(consumption) || 0) * (parseFloat(price) || 0);
  return Math.round(result * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate subtotal from array of costs
 * @param {Array} items - Array of items with cost property
 * @returns {number} - Sum of all costs
 */
export const calculateSubtotal = (items) => {
  if (!Array.isArray(items)) return 0;
  const total = items.reduce((sum, item) => {
    return sum + (parseFloat(item.cost) || 0);
  }, 0);
  return Math.round(total * 100) / 100;
};

/**
 * Calculate total material cost
 * @param {Object} sections - Object containing all material sections
 * @returns {number} - Total material cost
 */
export const calculateTotalMaterialCost = (sections) => {
  let total = 0;
  
  // Sum all material sections
  Object.values(sections).forEach(section => {
    if (Array.isArray(section)) {
      total += calculateSubtotal(section);
    }
  });
  
  return Math.round(total * 100) / 100;
};

/**
 * Calculate total factory cost
 * @param {number} materialCost - Total material cost
 * @param {Object} otherSections - Object containing operations, packaging, overhead
 * @returns {number} - Total factory cost
 */
export const calculateTotalFactoryCost = (materialCost, otherSections) => {
  let total = parseFloat(materialCost) || 0;
  
  Object.values(otherSections).forEach(section => {
    if (Array.isArray(section)) {
      total += calculateSubtotal(section);
    }
  });
  
  return Math.round(total * 100) / 100;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `$${(parseFloat(amount) || 0).toFixed(2)}`;
};

// ========================
// DATA MANAGEMENT FUNCTIONS
// ========================

/**
 * Save costing data to localStorage
 * @param {string} key - Storage key
 * @param {Object} data - Data to save
 */
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load costing data from localStorage
 * @param {string} key - Storage key
 * @returns {Object|null} - Loaded data or null
 */
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Get all saved costings from localStorage
 * @returns {Array} - Array of saved costings
 */
export const getAllSavedCostings = () => {
  const costings = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('costing_')) {
        const data = loadFromLocalStorage(key);
        if (data) {
          costings.push({ key, ...data });
        }
      }
    }
  } catch (error) {
    console.error('Error getting saved costings:', error);
  }
  return costings;
};

/**
 * Delete costing from localStorage
 * @param {string} key - Storage key
 */
export const deleteFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return false;
  }
};

// ========================
// EXPORT FUNCTIONS
// ========================

/**
 * Export data to CSV
 * @param {Object} data - Data to export
 * @param {string} filename - Filename for download
 */
export const exportToCSV = (data, filename = 'costing_export.csv') => {
  // Convert data to CSV format
  let csv = '';
  
  // Add customer info
  csv += 'Customer Information\n';
  csv += `Customer,${data.customerInfo?.customer || ''}\n`;
  csv += `Season,${data.customerInfo?.season || ''}\n`;
  csv += `Style#,${data.customerInfo?.styleNumber || ''}\n`;
  csv += `Style Name,${data.customerInfo?.styleName || ''}\n\n`;
  
  // Add sections
  const sections = ['yarn', 'fabric', 'trim', 'knitting', 'operations', 'packaging', 'overhead'];
  sections.forEach(section => {
    if (data[section] && data[section].length > 0) {
      csv += `\n${section.toUpperCase()}\n`;
      csv += 'Description,Consumption,Price,Cost\n';
      data[section].forEach(item => {
        csv += `"${item.description}",${item.consumption},${item.price},${item.cost}\n`;
      });
    }
  });
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Export data to Excel
 * @param {Object} data - Data to export
 * @param {string} filename - Filename for download
 */
export const exportToExcel = (data, filename = 'costing_export.xlsx') => {
  const wb = XLSX.utils.book_new();
  const wsData = [];
  
  // Add customer info
  wsData.push(['Customer Information']);
  wsData.push(['Customer:', data.customerInfo?.customer || '']);
  wsData.push(['Season:', data.customerInfo?.season || '']);
  wsData.push(['Style#:', data.customerInfo?.styleNumber || '']);
  wsData.push(['Style Name:', data.customerInfo?.styleName || '']);
  wsData.push([]);
  
  // Add sections
  const sections = ['yarn', 'fabric', 'trim', 'knitting', 'operations', 'packaging', 'overhead'];
  sections.forEach(section => {
    if (data[section] && data[section].length > 0) {
      wsData.push([section.toUpperCase()]);
      wsData.push(['Description', 'Consumption', 'Price', 'Cost']);
      data[section].forEach(item => {
        wsData.push([item.description, item.consumption, item.price, item.cost]);
      });
      wsData.push([]);
    }
  });
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Costing');
  XLSX.writeFile(wb, filename);
};

// ========================
// VALIDATION FUNCTIONS
// ========================

/**
 * Validate numeric input
 * @param {string} value - Value to validate
 * @returns {boolean} - True if valid number
 */
export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors
 */
export const validateCostingForm = (formData) => {
  const errors = {};
  
  // Validate customer info
  if (!isRequired(formData.customerInfo?.customer)) {
    errors.customer = 'Customer name is required';
  }
  if (!isRequired(formData.customerInfo?.season)) {
    errors.season = 'Season is required';
  }
  if (!isRequired(formData.customerInfo?.styleNumber)) {
    errors.styleNumber = 'Style number is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
