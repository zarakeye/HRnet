import { useEffect, useState } from "react";
import useEmployeeStore from '../app/hooks/store';

const UpdateNotification = () => {
  const hasChanges = useEmployeeStore(state => state.hasChanges);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasChanges) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasChanges]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white rounded px-4 py-2 shadow-lg z-50 animate-fadeIn">
      Données des employés mises à jour
      <button
        className="ml-2 text-sm underline"
        onClick={() => setVisible(false)}
      >
        Fermer
      </button>
    </div>
  );
};

export default UpdateNotification;
