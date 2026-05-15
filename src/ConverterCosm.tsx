import { Card, Text, Title } from '@mantine/core';

import { SgctConfigMPCDI } from './sgct/component';

export function CosmCard() {
  return (
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
  );
}
