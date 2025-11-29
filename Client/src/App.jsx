import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Appel à l'API backend
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())  // Réponse de l'API au format JSON
      .then((data) => setMessage(data.message))  // Mettre à jour l'état avec le message
      .catch((error) => console.error('Erreur:', error));  // Gestion des erreurs
  }, []);

  return (
    <div>
      <h1>{message}</h1>  {/* Affichage du message de l'API */}
    </div>
  );
}

export default App;
"// Initial deployment" 
