import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AskQuestion from "./pages/AskQuestions";
import PendingQuestions from "./pages/PendingQuestions";
import QuestionDetails from "./pages/QuetionDetails";
import AdminDashboard from "./pages/AdminDashBoard";
import AllQuestions from "./pages/MyQuestions";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground dark:bg-zinc-950 dark:text-zinc-50">
          <Header />
          <main className="container mx-auto px-4 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/pending" element={<PendingQuestions />} />
                <Route path="/all" element={<AllQuestions />} />
                <Route path="/q/:id" element={<QuestionDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};
export default App;
