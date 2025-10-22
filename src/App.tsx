// App.tsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './animations.css';

interface CostItem {
  type: string;
  notes: string;
  cost: number;
  description?: string;
  consumption?: number;
  price?: number;
}

interface BeanieFormData {
  customerInfo: Record<string, string>;
  yarn: CostItem[];
  fabric: CostItem[];
  trim: CostItem[];
  knitting: CostItem[];
  operations: CostItem[];
  packaging: CostItem[];
  overhead: CostItem[];
  notes: string;
}
import backgroundImg from './assets/EverestWallpaper.jpg';
import logoImg from './assets/WhiteLogoMadison.png';
import * as AppFunctions from './App.js';

const {
  readExcelFile,
  parseBeanieExcel,
  parseBallCapsExcel,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleFileInput,
} = AppFunctions as any;

// Sample data
const initialData = [
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA7Y8B-P2', styleName: 'BEANIE SHALLOW CUFF', mainMaterial: '50% Acrylic 50%Cotton 2/32NM', materialCons: '' },
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA2XAL-indo', styleName: 'CUFF SHORT SHORT', mainMaterial: '100%acrylic 2/285', materialCons: '' },
  { season: 'H22', customer: 'VANS', styleNumber: 'VN00036U', styleName: 'BEANIE SHALLOW CCUFF', mainMaterial: '100%acrylic 2/285', materialCons: '' },
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA3HJ9-tse dye washing', styleName: 'SCARF SQUAD SCARF', mainMaterial: '100%recycled polyester (REPREVE)', materialCons: '' },
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA7Y8B-P2', styleName: 'VANS WORLDWIDE BEANIE', mainMaterial: '100% COTTON 2/32 5MM', materialCons: '' },
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA5KO', styleName: 'SHORT CUFF', mainMaterial: '100%acrylic 2/285', materialCons: '' },
  { season: 'H22', customer: 'VANS', styleNumber: 'VNDA5KO', styleName: 'SHORT CUFF', mainMaterial: '100%acrylic 2/285', materialCons: '' },
  { season: 'F22', customer: 'VANS', styleNumber: 'VNDA5I1T-indo', styleName: 'Tall Order Beanie - Heather', mainMaterial: '100%acrylic 2/285', materialCons: '' },
  { season: 'H22', customer: 'VANS', styleNumber: 'VN00033N', styleName: 'SQUAD SCARF', mainMaterial: '100%%Acrylic 1/345', materialCons: '' },
  { season: 'H22', customer: 'VANS', styleNumber: 'VNDA5LG3', styleName: 'SPIRIT POM BEANIE', mainMaterial: '100%acrylic 1/345', materialCons: '' },
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);
  const [showBeanieTemplate, setShowBeanieTemplate] = useState(false);
  const [showBallCapsTemplate, setShowBallCapsTemplate] = useState(false);
  const [showImportSection, setShowImportSection] = useState(true);
  const [beanieData, setBeanieData] = useState<any>(null);
  const [ballCapsData, setBallCapsData] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const beanieFileInputRef = useRef<HTMLInputElement>(null);
  const ballCapsFileInputRef = useRef<HTMLInputElement>(null);
  const beanieTemplateRef = useRef<HTMLDivElement>(null);
  const ballCapsTemplateRef = useRef<HTMLDivElement>(null);
  const [beanieFormData, setBeanieFormData] = useState<BeanieFormData>({
    customerInfo: {},
    yarn: [],
    fabric: [],
    trim: [],
    knitting: [],
    operations: [],
    packaging: [],
    overhead: [],
    notes: ''
  });
  const [ballCapsFormData, setBallCapsFormData] = useState<any>({
    customerInfo: {},
    fabrics: [],
    otherFabrics: [],
    trims: [],
    operations: [],
    packaging: [],
    overhead: [],
    notes: ''
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => 
      Object.values(item).some(val => 
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  const handleBack = () => {
    setShowBeanieTemplate(false);
    setShowBallCapsTemplate(false);
    setShowImportSection(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleBeanieTemplate = () => {
    setShowBeanieTemplate(true);
    setShowBallCapsTemplate(false);
    setShowImportSection(false);
    
    // Wait for state to update and template to render
    setTimeout(() => {
      const yOffset = -30;
      const element = beanieTemplateRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const handleBallCapsTemplate = () => {
    setShowBallCapsTemplate(true);
    setShowBeanieTemplate(false);
    setShowImportSection(false);
    
    // Wait for state to update and template to render
    setTimeout(() => {
      const yOffset = -30;
      const element = ballCapsTemplateRef.current;
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  const processFile = async (file: File, templateType: 'beanie' | 'ballcaps') => {
    try {
      setUploadStatus('Processing file...');
      const workbook = await readExcelFile(file);
      
      if (templateType === 'beanie') {
        const parsedData = parseBeanieExcel(workbook);
        setBeanieData(parsedData);
        setBeanieFormData(parsedData);
        console.log('Beanie data loaded:', parsedData);
        setUploadStatus('✓ Beanie file loaded successfully');
      } else {
        const parsedData = parseBallCapsExcel(workbook);
        setBallCapsData(parsedData);
        setBallCapsFormData(parsedData);
        console.log('BallCaps data loaded:', parsedData);
        setUploadStatus('✓ BallCaps file loaded successfully');
      }
      
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      setUploadStatus('✗ Error processing file');
      console.error('File processing error:', error);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleBeanieFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrop(e, (file: File) => processFile(file, 'beanie'));
  };

  const handleBallCapsFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrop(e, (file: File) => processFile(file, 'ballcaps'));
  };

  const handleBeanieFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(e, (file: File) => processFile(file, 'beanie'));
  };

  const handleBallCapsFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(e, (file: File) => processFile(file, 'ballcaps'));
  };

  // Prevent default drag & drop behavior globally
  useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handlers: Array<keyof DocumentEventMap> = ['dragenter', 'dragover', 'dragleave', 'drop'];
    handlers.forEach((eventName) => {
      document.addEventListener(eventName, preventDefaults as EventListener, false);
    });

    return () => {
      handlers.forEach((eventName) => {
        document.removeEventListener(eventName, preventDefaults as EventListener, false);
      });
    };
  }, []);

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      <div className="content-wrapper">
        <div className="header">
          <div className="logo-title">
            <div className="logo">
              <img src={logoImg} alt="Madison88 Logo" className="logo-image" />
            </div>
            <div className="title">COSTING DEPARTMENT</div>
          </div>
        </div>

        <div className="controls-section">
          <div className="search-controls">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search across all fields... (e.g., TNF, SS26, beanie, F22)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>
            <button className="btn btn-search" onClick={handleSearch}>
              🔍 Search
            </button>
            <button className="btn btn-clear" onClick={handleClear}>
              Clear
            </button>
            <button className="btn btn-export" onClick={handleExport}>
              ⬇ Export
            </button>
          </div>
        </div>

        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>SEASON <span className="filter-icon">▼</span></th>
                  <th>CUSTOMER <span className="filter-icon">▼</span></th>
                  <th>STYLE NUMBER <span className="filter-icon">▼</span></th>
                  <th>STYLE NAME <span className="filter-icon">▼</span></th>
                  <th>MAIN MATERIAL <span className="filter-icon">▼</span></th>
                  <th>MATERIAL CONS <span className="filter-icon">▼</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="season-cell">{item.season}</td>
                      <td className="customer-cell">{item.customer}</td>
                      <td className="style-number-cell">{item.styleNumber}</td>
                      <td>{item.styleName}</td>
                      <td>{item.mainMaterial}</td>
                      <td>{item.materialCons}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="no-results">
                      No results found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showImportSection && (
          <div className="import-section">
            <div className="import-text">
              IMPORT YOUR EXCEL FILE
            </div>
            <div className="import-subtext">
              CHOOSE YOUR TEMPLATE
            </div>
            <div className="template-buttons">
              <button 
                className="btn-template" 
                onClick={handleBeanieTemplate}
                aria-label="Select Beanie Template"
              >
                BEANIE TEMPLATE
              </button>
              <button 
                className="btn-template" 
                onClick={handleBallCapsTemplate}
                aria-label="Select BallCaps Template"
              >
                BALLCAPS TEMPLATE
              </button>
            </div>
          </div>
        )}

        {showBallCapsTemplate && (
          <div className="ballcaps-template-panel" ref={ballCapsTemplateRef}>
            <div className="template-header">
              <h2>Factory Cost Breakdown</h2>
              <p className="template-subtitle">Template for BallCaps</p>
              <div className="template-header-buttons">
                <button className="btn btn-save">Save to Database</button>
                <button className="btn btn-back" onClick={handleBack}>← Back to Selection</button>
              </div>
            </div>

            <div className="template-content">
                <div className="template-left">
                {/* FABRICS Section */}
                <div className="cost-section">
                  <div className="section-header">FABRICS</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>(Name/Code/Description)Description</th>
                        <th>CONSUMPTION (YARD)</th>
                        <th>MATERIAL PRICE (USD/YD)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballCapsFormData.fabrics && ballCapsFormData.fabrics.length > 0 ? (
                        ballCapsFormData.fabrics.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description || ''} readOnly /></td>
                            <td><input type="text" value={item.consumption || ''} readOnly /></td>
                            <td><input type="text" value={item.price || ''} readOnly /></td>
                            <td><input type="text" value={item.cost ? item.cost.toFixed(2) : ''} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>                {/* OTHER FABRICS - TRIM/S Section */}
                <div className="cost-section">
                  <div className="section-header">OTHER FABRICS - TRIM/S</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>OTHER FABRICS - TRIM/S</th>
                        <th>CONSUMPTION (YARD)</th>
                        <th>MATERIAL PRICE (USD/YD)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballCapsFormData.otherFabrics && ballCapsFormData.otherFabrics.length > 0 ? (
                        ballCapsFormData.otherFabrics.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description || ''} readOnly /></td>
                            <td><input type="text" value={item.consumption || ''} readOnly /></td>
                            <td><input type="text" value={item.price || ''} readOnly /></td>
                            <td><input type="text" value={item.cost ? item.cost.toFixed(2) : ''} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Materials Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL MATERIAL AND SUBMATERIALS COST:</div>
                  <div className="total-value">
                    ${ballCapsFormData.totalMaterialCost ? ballCapsFormData.totalMaterialCost.toFixed(2) : '2.09'}
                  </div>
                </div>

                {/* TRIM/S Section */}
                <div className="cost-section">
                  <div className="section-header">TRIM/S</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>(Name/Code/Description)Description</th>
                        <th>CONSUMPTION (PIECE)</th>
                        <th>MATERIAL PRICE (USD/PC)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballCapsFormData.trims && ballCapsFormData.trims.length > 0 ? (
                        ballCapsFormData.trims.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description || ''} readOnly /></td>
                            <td><input type="text" value={item.consumption || ''} readOnly /></td>
                            <td><input type="text" value={item.price || ''} readOnly /></td>
                            <td><input type="text" value={item.cost ? item.cost.toFixed(2) : ''} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Materials Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL MATERIAL AND SUBMATERIALS COST:</div>
                  <div className="total-value">
                    ${ballCapsFormData.totalMaterialCost ? ballCapsFormData.totalMaterialCost.toFixed(2) : '2.09'}
                  </div>
                </div>                {/* OPERATIONS Section */}
                <div className="cost-section">
                  <div className="section-header">OPERATIONS</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>OPERATION</th>
                        <th>SAM</th>
                        <th colSpan={2 as any}>COST (USD/MIN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2 as any}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2 as any}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2 as any}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3 as any}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* PACKAGING Section */}
                <div className="cost-section">
                  <div className="section-header">PACKAGING</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>NOTES</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballCapsFormData.packaging && ballCapsFormData.packaging.length > 0 ? (
                        ballCapsFormData.packaging.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.type || ''} readOnly /></td>
                            <td><input type="text" value={item.notes || ''} readOnly /></td>
                            <td colSpan={2}><input type="text" value={item.cost ? item.cost.toFixed(2) : ''} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                        </>
                      )}
                      <tr className="subtotal-row">
                        <td colSpan={3}>SUB TOTAL</td>
                        <td>${ballCapsFormData.packagingTotal ? ballCapsFormData.packagingTotal.toFixed(2) : '0.00'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* OVERHEAD/PROFIT Section */}
                <div className="cost-section">
                  <div className="section-header">OVERHEAD/PROFIT</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballCapsFormData.overhead && ballCapsFormData.overhead.length > 0 ? (
                        ballCapsFormData.overhead.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.type || ''} readOnly /></td>
                            <td><input type="text" value={item.notes || ''} readOnly /></td>
                            <td colSpan={2}><input type="text" value={item.cost ? item.cost.toFixed(2) : ''} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" value="OVERHEAD" readOnly /></td><td><input type="text" /></td><td colSpan={2}><input type="text" value="0.25" readOnly /></td></tr>
                          <tr><td><input type="text" value="PROFIT" readOnly /></td><td><input type="text" /></td><td colSpan={2}><input type="text" value="0.80" readOnly /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Factory Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL FACTORY COST:</div>
                  <div className="total-value">
                    ${ballCapsFormData.totalFactoryCost ? ballCapsFormData.totalFactoryCost.toFixed(2) : '3.16'}
                  </div>
                </div>

              </div>

              <div className="template-right">
                <div className="info-panel">
                  <div className="form-group">
                    <label>Customer:</label>
                    <input type="text" placeholder="Enter customer name" value={ballCapsFormData.customerInfo.customer || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Season:</label>
                    <input type="text" placeholder="Enter season" value={ballCapsFormData.customerInfo.season || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Style#:</label>
                    <input type="text" placeholder="Enter style number" value={ballCapsFormData.customerInfo.styleNumber || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Style Name:</label>
                    <input type="text" placeholder="Enter style name" value={ballCapsFormData.customerInfo.styleName || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>MOQ:</label>
                    <input type="text" placeholder="Enter MOQ" value={ballCapsFormData.customerInfo.moq || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leadtime:</label>
                    <input type="text" placeholder="Enter leadtime" value={ballCapsFormData.customerInfo.leadtime || ''} readOnly />
                  </div>
                </div>

                <div className="upload-panel">
                  <div className="upload-icon">🖼️</div>
                  <p>Drag & Drop Image Here</p>
                  <p className="upload-subtext">or click to select</p>
                </div>

                <div className="notes-panel">
                  <label className="notes-label">Add your costing notes here...</label>
                  <textarea placeholder=""></textarea>
                </div>

                <div className="pricing-panel">
                  <p>Pricing item will appear here</p>
                </div>

                <div className="factory-call-panel">
                  <p>Factory Call</p>
                </div>

                <div
                  className="file-upload-panel"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleBallCapsFileDrop}
                  onClick={() => ballCapsFileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    ref={ballCapsFileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.xlsm,.csv"
                    onChange={handleBallCapsFileInput}
                    style={{ display: 'none' }}
                  />
                  <div className="file-upload-icon">📄</div>
                  <p>drag & drop</p>
                  <p className="file-upload-subtext">or click to select</p>
                  <p className="file-types">CSV • XLSX • XLSM</p>
                  {uploadStatus && <p style={{ color: uploadStatus.includes('✓') ? 'green' : 'red', marginTop: '10px' }}>{uploadStatus}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {showBeanieTemplate && (
          <div className="beanie-template-panel" ref={beanieTemplateRef}>
            <div className="template-header">
              <h2>Factory Cost Breakdown</h2>
              <p className="template-subtitle">Template for Beanie</p>
              <div className="template-header-buttons">
                <button className="btn btn-save">Save to Database</button>
                <button className="btn btn-back" onClick={handleBack}>← Back to Selection</button>
              </div>
            </div>

            <div className="template-content">
              <div className="template-left">
                {/* YARN Section */}
                <div className="cost-section">
                  <div className="section-header">YARN</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>YARN</th>
                        <th>CONSUMPTION (G)</th>
                        <th>MATERIAL PRICE (USD/KG)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.yarn && beanieFormData.yarn.length > 0 ? (
                        beanieFormData.yarn.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description} readOnly /></td>
                            <td><input type="text" value={item.consumption} readOnly /></td>
                            <td><input type="text" value={item.price} readOnly /></td>
                            <td><input type="text" value={`${item.cost.toFixed(2)}`} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* FABRIC Section */}
                <div className="cost-section">
                  <div className="section-header">FABRIC</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>FABRIC</th>
                        <th>CONSUMPTION (YARDS)</th>
                        <th>MATERIAL PRICE (USD/YD)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.fabric && beanieFormData.fabric.length > 0 ? (
                        beanieFormData.fabric.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description} readOnly /></td>
                            <td><input type="text" value={item.consumption} readOnly /></td>
                            <td><input type="text" value={item.price} readOnly /></td>
                            <td><input type="text" value={`${item.cost.toFixed(2)}`} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TRIM Section */}
                <div className="cost-section">
                  <div className="section-header">TRIM</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>TRIM</th>
                        <th>CONSUMPTION (PIECE)</th>
                        <th>MATERIAL PRICE (USD/PC)</th>
                        <th>MATERIAL COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.trim && beanieFormData.trim.length > 0 ? (
                        beanieFormData.trim.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description} readOnly /></td>
                            <td><input type="text" value={item.consumption} readOnly /></td>
                            <td><input type="text" value={item.price} readOnly /></td>
                            <td><input type="text" value={`${item.cost.toFixed(2)}`} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Materials Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL MATERIAL AND SUBMATERIALS COST:</div>
                  <div className="total-value">${(
                    (beanieFormData.yarn ? beanieFormData.yarn.reduce((sum, item) => sum + item.cost, 0) : 0) +
                    (beanieFormData.fabric ? beanieFormData.fabric.reduce((sum, item) => sum + item.cost, 0) : 0) +
                    (beanieFormData.trim ? beanieFormData.trim.reduce((sum, item) => sum + item.cost, 0) : 0)
                  ).toFixed(2)}</div>
                </div>

                {/* KNITTING Section */}
                <div className="cost-section">
                  <div className="section-header">KNITTING</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>KNITTING</th>
                        <th>KNITTING TIME (MINS)</th>
                        <th>KNITTING SAM (USD/MIN)</th>
                        <th>KNITTING COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.knitting && beanieFormData.knitting.length > 0 ? (
                        beanieFormData.knitting.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description} readOnly /></td>
                            <td><input type="text" value={item.consumption} readOnly /></td>
                            <td><input type="text" value={item.price} readOnly /></td>
                            <td><input type="text" value={`${item.cost.toFixed(2)}`} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* OPERATIONS Section */}
                <div className="cost-section">
                  <div className="section-header">OPERATIONS</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>OPERATION</th>
                        <th>SAM</th>
                        <th colSpan={2}>COST (USD/MIN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.operations && beanieFormData.operations.length > 0 ? (
                        beanieFormData.operations.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td><input type="text" value={item.description} readOnly /></td>
                            <td><input type="text" value={item.consumption} readOnly /></td>
                            <td colSpan={2}><input type="text" value={`${item.cost.toFixed(2)}`} readOnly /></td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PACKAGING Section */}
                <div className="cost-section">
                  <div className="section-header">PACKAGING</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.packaging && beanieFormData.packaging.length > 0 ? (
                        beanieFormData.packaging.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.type || ''}</td>
                            <td>{item.notes || ''}</td>
                            <td colSpan={2}>${item.cost ? item.cost.toFixed(2) : '0.00'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* OVERHEAD/PROFIT Section */}
                <div className="cost-section">
                  <div className="section-header">OVERHEAD/PROFIT</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>TYPE</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beanieFormData.overhead && beanieFormData.overhead.length > 0 ? (
                        beanieFormData.overhead.map((item: CostItem, idx: number) => (
                          <tr key={idx}>
                            <td>{item.type || ''}</td>
                            <td>{item.notes || ''}</td>
                            <td colSpan={2}>${item.cost ? item.cost.toFixed(2) : '0.00'}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                          <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Factory Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL FACTORY COST:</div>
                  <div className="total-value">${(
                    (beanieFormData.yarn ? beanieFormData.yarn.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.fabric ? beanieFormData.fabric.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.trim ? beanieFormData.trim.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.knitting ? beanieFormData.knitting.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.operations ? beanieFormData.operations.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.packaging ? beanieFormData.packaging.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0) +
                    (beanieFormData.overhead ? beanieFormData.overhead.reduce((sum: number, item: CostItem) => sum + (item.cost || 0), 0) : 0)
                  ).toFixed(2)}</div>
                </div>
              </div>

              <div className="template-right">
                <div className="info-panel">
                  <div className="form-group">
                    <label>Customer:</label>
                    <input type="text" placeholder="Enter customer name" value={beanieFormData.customerInfo.customer || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Season:</label>
                    <input type="text" placeholder="Enter season" value={beanieFormData.customerInfo.season || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Style#:</label>
                    <input type="text" placeholder="Enter style number" value={beanieFormData.customerInfo.styleNumber || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Style Name:</label>
                    <input type="text" placeholder="Enter style name" value={beanieFormData.customerInfo.styleName || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Costed Quantity:</label>
                    <input type="text" placeholder="Enter quantity" value={beanieFormData.customerInfo.costedQuantity || ''} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Leadtime:</label>
                    <input type="text" placeholder="Enter leadtime" value={beanieFormData.customerInfo.leadtime || ''} readOnly />
                  </div>
                </div>

                <div className="upload-panel">
                  <div className="upload-icon">📦</div>
                  <p>Drag & Drop Image Here</p>
                  <p className="upload-subtext">or click to select</p>
                </div>

                <div className="notes-panel">
                  <textarea placeholder="Add your costing notes here..."></textarea>
                </div>

                <div className="pricing-panel">
                  <p>Pricing item will appear here</p>
                </div>

                <div className="factory-call-panel">
                  <p>Factory Call</p>
                </div>

                <div
                  className="file-upload-panel"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleBeanieFileDrop}
                  onClick={() => beanieFileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    ref={beanieFileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.xlsm,.csv"
                    onChange={handleBeanieFileInput}
                    style={{ display: 'none' }}
                  />
                  <div className="file-upload-icon">📄</div>
                  <p>drag & drop</p>
                  <p className="file-upload-subtext">or click to select</p>
                  <p className="file-types">CSV • XLSX • XLSM</p>
                  {uploadStatus && <p style={{ color: uploadStatus.includes('✓') ? 'green' : 'red', marginTop: '10px' }}>{uploadStatus}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;