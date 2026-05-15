import { SgctConfigMPCDI, SgctConfigVersion } from './sgct/component';

export default function App() {
  return (
    <main>
      <h1>OpenSpace Conversion Functions</h1>

      <div className={'card'}>
        <h2>SGCT Configuration Version Converter</h2>
        <p>
          This converter is used to update SGCT configuration files from older versions to
          the newest supported version.
        </p>
        <SgctConfigVersion />
      </div>

      <div className={'card'}>
        <h2>COSM configuration file converter</h2>
        <p>
          This converter takes a COSM MPCDI configuration file and converts it into a
          format that can be loaded by SGCT.
        </p>
        <SgctConfigMPCDI />
      </div>

      <div className={'logo-container'}>
        <img
          src={'/openspace-horiz-logo.png'}
          alt={'OpenSpace Logo'}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </main>
  );
}
