import React, { useState } from 'react';
import Layout from './components/ui/Layout';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);

  return (
    <Layout currentMode={mode} onModeChange={setMode}>
      {mode === AppMode.CHAT ? <ChatView /> : <ImageView />}
    </Layout>
  );
};

export default App;