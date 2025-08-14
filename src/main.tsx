import { ConfigProvider } from 'antd'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app/App'
import Container from './components/Container'
import Header from './components/Header'
import './index.css'
import DatabaseSpinner from './components/DatabaseSpinner'
import useEmployeeStore from './app/hooks/store'

const RootComponent = () => {
  const loadEmployees = useEmployeeStore(state => state.loadEmployees);
  const loading = useEmployeeStore(state => state.loading);
  const lastFetched = useEmployeeStore(state => state.lastFetched);

  const employees = useEmployeeStore(state => state.employees);

  useEffect(() => {
    // Charger les employés seulement si nécessaire
    if (!lastFetched || Date.now() - lastFetched > 5 * 6 * 1000) {
      loadEmployees();
    }
  }, [employees.length]);

  const theme = {
    token: {
      motion: !loading,
      colorBgBase: '#101828',
      colorBgContainer: '#101828',
    },
    components: {
      Select: {
        colorPrimaryHover: 'transparent',
        controlOutline: 'none',
        selectorBg: '#101828',
        optionSelectedBg: '#787878',
        colorText: '#fff',
        colorTextPlaceholder: '#99a1af',
        colorBorder: '#101828',
        activeBorderColor: '#101828',
        borderRadius: 10,
        multiItemBg: '#101828'
      },
      DatePicker: {
        activeShadow: '0 0 7px 0px #7f7fbe',
        colorBgElevated: '#101828',
        colorText: '#fff',
        colorTextPlaceholder: '#99a1af',
        colorBorder: '#101828',
        controlOutline: '#7F7FBE',
        activeBorderColor: '#7F7FBE',
        hoverBorderColor: '#7F7FBE',
        controlItemBgHover: 'rgba(127, 127, 190, 0.1)',
        cellHoverBg: '#99a1af',
        cellActiveWithRangeBg: '#7f7fbe',
        cellRangeBorderColor: '#7f7fbe',
        cellDisabledColor: '#d9d9d9',
        cellBgDisabled: '',
        multipleItemBg: '#7F7FBE',

        /* Style des en-têtes (mois/années) */
        headerBg: '#fff',
        colorTextHeading: '#7f7fbe',
        colorIcon: '#7f7fbe',
        colorTextQuaternary: 'a0a0a0',

        /* Style du panneau */
        panelBg: '#fff',
      },
      Modal: {
        contentBg: '#99a1af'
      },
      Checkbox: {
        colorBgContainer: '#fff',
        colorText: 'black'
      }
    }
  };

  return (
    <React.StrictMode>
      <Router>
        <ConfigProvider theme={theme}>
          {loading && <DatabaseSpinner />}  {/* Spinner au niveau racine */}


        <div className={loading ? 'blur-sm' : ''}>
          <Header />
          <Container>
            <App />
          </Container>
          </div>
        </ConfigProvider>
      </Router>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Failed to find the root element in the HTML. Ensure you have a <div id='root'></div> in your index.html file.");
}
const root = createRoot(rootElement)

root.render(<RootComponent />)


