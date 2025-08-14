import { useEffect, useState, useRef } from "react";
import useEmployeeStore from '../../app/hooks/store';

const UpdateNotification = () => {
  const hasChanges = useEmployeeStore(state => state.hasChanges);
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const closingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hasChanges) {
      // Annuler les timers précédents
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
      if (closingTimer.current) clearTimeout(closingTimer.current);

      setVisible(true);
      setIsClosing(false);

      // Fermeture automatique après 5s
      autoCloseTimer.current = setTimeout(() => {
        setIsClosing(true);
        closingTimer.current = setTimeout(() => {
          setVisible(false);
        }, 300); // Correspond à la durée de l'animation
      }, 5000);
    }

    // Nettoyage des timers
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
      if (closingTimer.current) clearTimeout(closingTimer.current);
    };
  }, [hasChanges]);

  const handleClose = () => {
    // Annuler la fermeture automatique
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    
    // Démarrer l'animation de fermeture
    setIsClosing(true);
    closingTimer.current = setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`
      fixed bottom-4 right-4 bg-green-600 text-white rounded-lg px-4 py-2 shadow-lg z-50
      flex items-center space-x-2
      ${isClosing ? 
        'animate-fadeOutDown' : 
        'animate-fadeInUp'
      }
    `}
    >
      <span>Données des employés mises à jour</span>
      <button
        className="text-sm underline hover:text-green-200 transition-colors"
        onClick={handleClose}
      >
        Fermer
      </button>
    </div>
  );
};

export default UpdateNotification;
