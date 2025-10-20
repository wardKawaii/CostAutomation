import './App.css'

function App() {
  return (
    <>
      <div className="bg">
        <header className="topbar">
          <div className="container bar">
            <div className="brand">
              <div className="logo" aria-hidden="true" />
              <div className="titles">
                <div className="company">madison88</div>
                <div className="dept">Business Solutions Asia, Inc</div>
                <div className="dept">COSTING DEPARTMENT</div>
              </div>
            </div>
          </div>
        </header>

        <main className="panel-wrap">
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
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No data available. Connect to Supabase to load costing data.
                    </td>
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
