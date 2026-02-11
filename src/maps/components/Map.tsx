import { GebetaMap } from '@gebeta/tiles';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function Map() {
  
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <GebetaMap
        apiKey={apiKey}
        center={[38.7578, 8.9806]}
        zoom={12}
      />
    </div>
  );
}
