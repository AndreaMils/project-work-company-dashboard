import { ThemeProvider } from "./ThemeContext";
import Dashboard from "./components/Dashboard";

function App() {
  return <Dashboard />;
}

function AppWithTheme() {
  return (
    <ThemeProvider>
      <div>
        <App />
      </div>
    </ThemeProvider>
  );
}

export default AppWithTheme;
