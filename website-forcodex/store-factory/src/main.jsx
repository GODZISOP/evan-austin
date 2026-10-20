import React from 'react';
import { createRoot } from 'react-dom/client';
import CommerceApp from './commerce/App.jsx';
import LegacyBuilder from './Builder.jsx';
import './styles.css';
import './commerce/commerce.css';
import './commerce/templates.css';

const App = new URLSearchParams(location.search).get('workspace') === 'legacy' ? LegacyBuilder : CommerceApp;

class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    return this.state.error ? <main className="fatal"><h1>We could not open this screen.</h1><p>Reload to try again. Your saved websites have not been cleared.</p><button onClick={() => location.reload()}>Reload page</button></main> : this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><App /></ErrorBoundary></React.StrictMode>);
