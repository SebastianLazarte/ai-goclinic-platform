import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/auth/AuthWrapper';
import MainContent from './components/MainContent';

function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <MainContent />
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;