// App.js
import React, { useState } from 'react';
import './App.css';
import backgroundImg from './assets/EverestWallpaper.jpg';
import logoImg from './assets/WhiteLogoMadison.png';

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

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleBeanieTemplate = () => {
    setShowBeanieTemplate(!showBeanieTemplate);
    setShowBallCapsTemplate(false);
  };

  const handleBallCapsTemplate = () => {
    setShowBallCapsTemplate(!showBallCapsTemplate);
    setShowBeanieTemplate(false);
  };

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

        <div className="import-section">
          <div className="import-text">
            IMPORT YOUR EXCEL FILE
          </div>
          <div className="template-buttons">
            <button className="btn btn-template" onClick={handleBeanieTemplate}>
              Beanie Template
            </button>
            <button className="btn btn-template" onClick={handleBallCapsTemplate}>
              BallCaps Template
            </button>
          </div>
        </div>

        {showBallCapsTemplate && (
          <div className="beanie-template-panel">
            <div className="template-header">
              <h2>Factory Cost Breakdown</h2>
              <p className="template-subtitle">Template for BallCaps</p>
              <div className="template-header-buttons">
                <button className="btn btn-save">Save to Database</button>
                <button className="btn btn-back" onClick={handleBallCapsTemplate}>← Back to Selection</button>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* OTHER FABRICS - TRIM/S Section */}
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Materials Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL MATERIAL AND SUBMATERIALS COST:</div>
                  <div className="total-value">$0.00</div>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* OVERHEAD/PROFIT Section */}
                <div className="cost-section">
                  <div className="section-header">OVERHEAD/PROFIT</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>OVERHEAD/PROFIT</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Factory Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL FACTORY COST:</div>
                  <div className="total-value">$0.00</div>
                </div>
              </div>

              <div className="template-right">
                <div className="info-panel">
                  <div className="form-group">
                    <label>Customer:</label>
                    <input type="text" placeholder="Enter customer name" />
                  </div>
                  <div className="form-group">
                    <label>Season:</label>
                    <input type="text" placeholder="Enter season" />
                  </div>
                  <div className="form-group">
                    <label>Style#:</label>
                    <input type="text" placeholder="Enter style number" />
                  </div>
                  <div className="form-group">
                    <label>Style Name:</label>
                    <input type="text" placeholder="Enter style name" />
                  </div>
                  <div className="form-group">
                    <label>MOQ:</label>
                    <input type="text" placeholder="Enter MOQ" />
                  </div>
                  <div className="form-group">
                    <label>Leadtime:</label>
                    <input type="text" placeholder="Enter leadtime" />
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

                <div className="file-upload-panel">
                  <div className="file-upload-icon">📄</div>
                  <p>drag & drop</p>
                  <p className="file-upload-subtext">or click to select</p>
                  <p className="file-types">CSV • XLSX • XLSM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showBeanieTemplate && (
          <div className="beanie-template-panel">
            <div className="template-header">
              <h2>Factory Cost Breakdown</h2>
              <p className="template-subtitle">Template for Beanie</p>
              <div className="template-header-buttons">
                <button className="btn btn-save">Save to Database</button>
                <button className="btn btn-back" onClick={handleBeanieTemplate}>← Back to Selection</button>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Materials Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL MATERIAL AND SUBMATERIALS COST:</div>
                  <div className="total-value">$0.00</div>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
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
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* PACKAGING Section */}
                <div className="cost-section">
                  <div className="section-header">PACKAGING</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>PACKAGING</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* OVERHEAD/PROFIT Section */}
                <div className="cost-section">
                  <div className="section-header">OVERHEAD/PROFIT</div>
                  <table className="cost-table">
                    <thead>
                      <tr>
                        <th>OVERHEAD/PROFIT</th>
                        <th>Factory Notes</th>
                        <th colSpan={2}>COST</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td><input type="text" /></td><td><input type="text" /></td><td colSpan={2}><input type="text" /></td></tr>
                      <tr className="subtotal-row"><td colSpan={3}>SUB TOTAL</td><td>$0.00</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Factory Cost */}
                <div className="total-box">
                  <div className="total-label">TOTAL FACTORY COST:</div>
                  <div className="total-value">$0.00</div>
                </div>
              </div>

              <div className="template-right">
                <div className="info-panel">
                  <div className="form-group">
                    <label>Customer:</label>
                    <input type="text" placeholder="Enter customer name" />
                  </div>
                  <div className="form-group">
                    <label>Season:</label>
                    <input type="text" placeholder="Enter season" />
                  </div>
                  <div className="form-group">
                    <label>Style#:</label>
                    <input type="text" placeholder="Enter style number" />
                  </div>
                  <div className="form-group">
                    <label>Style Name:</label>
                    <input type="text" placeholder="Enter style name" />
                  </div>
                  <div className="form-group">
                    <label>Costed Quantity:</label>
                    <input type="text" placeholder="Enter quantity" />
                  </div>
                  <div className="form-group">
                    <label>Leadtime:</label>
                    <input type="text" placeholder="Enter leadtime" />
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

                <div className="file-upload-panel">
                  <div className="file-upload-icon">📄</div>
                  <p>drag & drop</p>
                  <p className="file-upload-subtext">or click to select</p>
                  <p className="file-types">CSV • XLSX • XLSM</p>
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