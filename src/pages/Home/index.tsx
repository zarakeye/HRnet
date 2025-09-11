import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/useEmployeeStore';
import { useAuthStore } from '../../app/hooks/useAuthStore';
import EmployeeTable from '../../components/EmployeeTable';
import DatabaseSpinner from '../../components/DatabaseSpinner';
import PasswordModal from '../../components/PasswordModal';

/**
 * Component that renders a table of employees in the store.
 * The table includes columns for the employee's first name, last name, date of birth, start date, street, city, state, zip code, and department.
 * The table also includes a button to add a new employee.
 * The component uses the useEmployeeStore hook to get the employees from the store.
 * The component uses the navigate hook to navigate to the /create-employee page when the add button is clicked.
 * The component uses the Table component from react-ts-tab-lib to render the table.
 * The component uses a custom renderer for the date columns to format the date as 'DD/MM/YYYY'.
 * The component uses a custom renderer for the last name column to format the last name as all uppercase.
 * The component uses a custom renderer for the search bar to add a search icon.
 */
function Home(): JSX.Element {
  const navigate = useNavigate();
const {
    employees,
    loading,
    isUpdateAvailable,
    // lastUpdate,
    checkForUpdate,
    // acknowledgeUpdate,
    loadEmployees
    
  } = useEmployeeStore();

  const { isAuthenticated, login, error: authError } = useAuthStore();
  const [showRefrechDialog, setShowRefreshDialog] = useState<boolean>(false);
  const [applyUpdates, setApplyUpdates] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
      // Check for updates every 4 minutes
      const intervalId = setInterval(checkForUpdate, 4 * 60 * 1000); // 4 minutes en millisecondes

      // Nettoyer l'intervalle lorsque le composant est monté
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setShowPasswordModal(true);
    }
  }, [isAuthenticated, loadEmployees, checkForUpdate]);

  useEffect(() => {
    if (applyUpdates) {
      loadEmployees();
      setApplyUpdates(false);
    }
  }, [applyUpdates, loadEmployees]);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowRefreshDialog(true);
    }
  }, [isUpdateAvailable]);

  const handlePasswordSubmit = async (password: string) => {
    const success = await login(password);
    if (success) {
      setShowPasswordModal(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        error={authError}
      />
    );
  }

  return (
    <main className='pt-[225px] h-[699px] max-h-[700px] '>
      {/* Notification de mise à jour */}
      {showRefrechDialog && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-4 animate-fade-in">
          <span>New employee data available!</span>
          <button
            onClick={() => {
              setShowRefreshDialog(false);
              setApplyUpdates(true);
            }}
            className="bg-white text-green-600 px-3 py-1 rounded font-semibold hover:bg-green-100 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Indicateur de chargement en arrière-plan discret */}
      {loading && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
          Syncing...
        </div>
      )}

      <div className='bg-white text-center fixed left-[50%] rounded-[25px] translate-x-[-50%] top-[200px] z-5'>
        <div className='px-[300px] py-[30px] bg-gray-900 rounded-[25px]'>
          <h2 className='text-center text-white font-bold text-4xl pb-[25px] whitespace-nowrap'>Current Employees</h2>
        
          <button
            type='button'
            className='bg-red-900 hover:bg-red-800 hover:shadow-[0_0_7px_3px_#9f0712] text-white font-bold rounded-[20px] px-[15px] py-[8px]  whitespace-nowrap'
            onClick={() => navigate('/create-employee')}
          >
            Add Employee
          </button>
        </div>
      </div>

      <div className='xs:px-[10px] sm:px-[10px] md:px-[100px] lg:px-[150px]  max-h-[500px] mt-[200px] overflow-y-auto'>
        {/* Spinner pendant le chargement initial */}
        {loading && employees.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <DatabaseSpinner />
          </div>
        ) : (
          <EmployeeTable employees={employees} />
        )}
      </div>
    </main>
  );
}

export default Home;