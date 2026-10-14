import CreateUnitPage from "./pages/CreateUnitPage";
import CreateSessionPage from "./pages/CreateSessionPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import TeachingPanel from "./pages/TeachingPanel";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { GuestRoute } from "./components/routing/GuestRoute";
import Explorer from "./pages/Explorer";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explorer" element={<ProtectedRoute><Explorer /></ProtectedRoute>} />
                    <Route path="/teachingpanel/crear-unidad/:courseId" element={<ProtectedRoute><CreateUnitPage /></ProtectedRoute>} />
                    <Route path="/teachingpanel/editar-unidad/:unitId" element={<ProtectedRoute><CreateUnitPage /></ProtectedRoute>} />
                    <Route path="/teachingpanel/crear-sesion/:teachingUnitId" element={<ProtectedRoute><CreateSessionPage /></ProtectedRoute>} />
                    <Route path="/teachingpanel/editar-sesion/:sessionId" element={<ProtectedRoute><CreateSessionPage /></ProtectedRoute>} />
                    <Route path="/teachingpanel" element={<ProtectedRoute><TeachingPanel /></ProtectedRoute>} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;