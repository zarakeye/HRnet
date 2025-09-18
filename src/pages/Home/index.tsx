import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/useEmployeeStore';
import { useAuthStore } from '../../app/hooks/useAuthStore';
import EmployeeTable from '../../components/EmployeeTable';
import DatabaseSpinner from '../../components/DatabaseSpinner';
import PasswordModal from '../../components/PasswordModal';
import closeIcon from '../../assets/close.svg';
import UpdateNotification from '../../components/UpdateNotification';
// import { Employee } from '../../common/types';

/**
 * Page displaying the list of current employees.
 * If the user is not authenticated, a password modal is displayed.
 * If the user is authenticated, the page displays a button to add a new employee and a table displaying the list of current employees.
 * A notification is displayed if new employee data is available.
 * A spinner is displayed in the center of the page if the employee data is being loaded.
 * The page is responsive and the layout adapts to different screen sizes.
 */
function Home(): JSX.Element {
  const navigate = useNavigate();
  const {
      employees,
      loading,
      isUpdateAvailable,
      checkForUpdate,
      loadEmployees
    } = useEmployeeStore();

  const { isAuthenticated, login, error: authError } = useAuthStore();
  const [showRefrechDialog, setShowRefreshDialog] = useState<boolean>(false);
  const [applyUpdates, setApplyUpdates] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  // let rows: Employee[] | null = [];

  useEffect(() => {
    if (isAuthenticated) {
      loadEmployees();
      // Check for updates every 4 minutes
      // const intervalId = setInterval(checkForUpdate, 4 * 60 * 1000); // 4 minutes en millisecondes

      // // Nettoyer l'intervalle lorsque le composant est monté
      // return () => {
      //   clearInterval(intervalId);
      // };
    } else {
      setShowPasswordModal(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(checkForUpdate, 1 * 60 * 1000);
      console.log(`boucle checkForUpdate => employees: ${employees}`);

      return () => {
        clearInterval(intervalId);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (applyUpdates) {
      loadEmployees();
      setApplyUpdates(false);
    }
  }, [applyUpdates]);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowRefreshDialog(true);
    }
  }, [isUpdateAvailable]);

  /**
   * Handles the submission of the password in the password modal.
   * If the login is successful, the password modal is closed.
   * @param {string} password The password to be submitted to the login function.
   */
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
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex flex-row items-center space-x-4 animate-fade-in">
          <div className="flex align-center">
            <span>New employees data available!</span>
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
          <button>
            <img src={closeIcon} alt="Close" className='h-[20px] w-[20px] cursor-pointer' onClick={() => setShowRefreshDialog(false)} />
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
      <UpdateNotification />
    </main>
  );
}

export default Home;