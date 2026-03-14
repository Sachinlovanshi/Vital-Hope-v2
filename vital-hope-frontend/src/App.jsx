import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import VideoCall from "./pages/VideoCall";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterHospital from "./pages/RegisterHospital";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/expert" element={<ExpertDashboard />} />
          <Route path="/video/:roomId" element={<VideoCall />} />
          <Route path="/admin" element={<AdminDashboard />} />
         <Route path="/register-hospital" element={<RegisterHospital />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
// function App() {
//   return (
//     <div>
//       <h1>Vital Hope Frontend Running 🚀</h1>
//     </div>
//   );
// }

// export default App;


