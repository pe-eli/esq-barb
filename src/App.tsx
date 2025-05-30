import AppRoutes from './routes/homeRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <main>
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}

export default App;
