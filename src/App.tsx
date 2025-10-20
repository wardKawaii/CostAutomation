import './App.css'
import logoImage from './assets/WhiteLogoMadison.png'
import backgroundImage from './assets/EverestWallpaper.jpg'

function App() {
  return (
    <>
      <div className="bg" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <header className="topbar">
          <div className="container">
            <div className="header-container">
              <div className="brand-left">
                <img src={logoImage} alt="Madison88 Logo" className="logo" />
              </div>
              <div className="department">COSTING DEPARTMENT</div>
            </div>
          </div>
        </header>

        <main className="panel-wrap" style={{paddingLeft: 100, paddingRight: 100}}>
          <section className="panel container" aria-labelledby="search-heading">
            <h2 id="search-heading" className="sr-only">Search</h2>

            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search across all fields... (e.g., TNF, SS26, beanie, F22)"
                aria-label="Search across all fields"
              />
              <button type="button" aria-label="Clear search" className="icon-btn">✕</button>
              <button type="submit" className="btn primary">Search</button>
              <button type="button" className="btn">Clear</button>
              <button type="button" className="btn secondary">Export</button>
            </form>

            <div className="table-wrap" role="region" aria-label="Results">
              <table className="grid">
                <thead>
                  <tr>
                    <th>Season</th>
                    <th>Customer</th>
                    <th>Style Number</th>
                    <th>Style Name</th>
                    <th>Main Material</th>
                    <th>Material Cons</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A7YRB-P2</td>
                    <td>BEANIE SHALLOW CUFF</td>
                    <td>50% Acrylic 50% Cotton 2/32NM</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A2XAL-Indo</td>
                    <td>CUFF SHORT SHORT</td>
                    <td>100%acrylic 2/28S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>H22</td>
                    <td>VANS</td>
                    <td>VN00036U</td>
                    <td>BEANIE SHALLOW CCUFF</td>
                    <td>100%acrylic 2/28S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A3HJ9-tie dye washing</td>
                    <td>SCARF SQUAD SCARF</td>
                    <td>100% recycled polyester (REPREVE)</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A7YRR-P2</td>
                    <td>VANS WORLDWIDE BEANIE</td>
                    <td>100% COTTON,2/32 SMM</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A5KIO</td>
                    <td>SHORT CUFF</td>
                    <td>100%acrylic 2/28S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>H22</td>
                    <td>VANS</td>
                    <td>VN0A5KIO</td>
                    <td>SHORT CUFF</td>
                    <td>100% acrylic 2/28S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>F22</td>
                    <td>VANS</td>
                    <td>VN0A511T-Indo</td>
                    <td>Tall Order Beanie - Heather</td>
                    <td>100% acrylic 2/28S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>H22</td>
                    <td>VANS</td>
                    <td>VN00033N</td>
                    <td>SQUAD SCARF</td>
                    <td>100%%Acrylic-1/34S</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>H22</td>
                    <td>VANS</td>
                    <td>VN0A5LG3</td>
                    <td>SPIRIT POM BEANIE</td>
                    <td>100%acrylic 1/34s</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer className="container footer">
          <small>© {new Date().getFullYear()} Costing. All rights reserved.</small>
        </footer>
      </div>
    </>
  )
}

export default App
