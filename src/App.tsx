import { Container, Title } from '@mantine/core';

import { CosmConverter } from './components/CosmConverter';
import { SgctVersionConverter } from './components/SgctVersionConverter';
import { PageSection } from './components/PageSection';

export default function App() {
  return (
    <Container py={'md'}>
      <Title order={1} ta={'center'} mb={'md'}>
        OpenSpace Conversion Functions
      </Title>

      <PageSection
        title={'SGCT Converters'}
        description={
          'Tools for converting SGCT configuration files between formats and versions and support conversions between vendor-specific configuration files into SGCT configuration files.'
        }
      >
        <SgctVersionConverter />
        <CosmConverter />
      </PageSection>

      <div className={'logo-container'}>
        <img
          src={'/openspace-horiz-logo.png'}
          alt={'OpenSpace Logo'}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </Container>
  );
}
