import { Card, Container, Stack, Text, Title } from '@mantine/core';

import { SgctConfigMPCDI, SgctConfigVersion } from './sgct/component';

export default function App() {
  return (
    <Container py={'md'}>
      <Title order={1} ta={'center'} mb={'md'}>
        OpenSpace Conversion Functions
      </Title>

      <Stack>
        <Card shadow={'sm'} padding={'md'} radius={'md'} withBorder>
          <Title order={2} mb={'xs'}>
            SGCT Configuration Version Converter
          </Title>
          <Text mb={'xs'}>
            This converter is used to update SGCT configuration files from older versions
            to the newest supported version.
          </Text>
          <SgctConfigVersion />
        </Card>

        <Card shadow={'sm'} padding={'md'} radius={'md'} withBorder>
          <Title order={2} mb={'xs'}>
            COSM configuration file converter
          </Title>
          <Text mb={'xs'}>
            This converter takes a COSM MPCDI configuration file and converts it into a
            format that can be loaded by SGCT.
          </Text>
          <SgctConfigMPCDI />
        </Card>
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
