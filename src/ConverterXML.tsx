import { Card, Text, Title } from '@mantine/core';

import { SgctConfigVersion } from './sgct/component';

export function SgctVersionCard() {
  return (
    <Card shadow={'sm'} padding={'md'} radius={'md'} withBorder>
      <Title order={2} mb={'xs'}>
        SGCT Configuration Version Converter
      </Title>
      <Text mb={'xs'}>
        This converter is used to update SGCT configuration files from older versions to
        the newest supported version.
      </Text>
      <SgctConfigVersion />
    </Card>
  );
}
