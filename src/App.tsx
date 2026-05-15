import { Container, Stack, Title } from '@mantine/core';

import { CosmConverter } from './sgct/components/CosmConverter';
import { SgctVersionConverter } from './sgct/components/SgctVersionConverter';

export default function App() {
  return (
    <Container py={'md'}>
      <Title order={1} ta={'center'} mb={'md'}>
        OpenSpace Conversion Functions
      </Title>

      <Stack>
        <SgctVersionConverter />
        <CosmConverter />
      </Stack>

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
