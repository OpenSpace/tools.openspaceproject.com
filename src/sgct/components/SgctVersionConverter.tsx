import { Card, Text, Title } from '@mantine/core';

import { convertFileVersion } from '../util/converters';

import { FileConverter } from './FileConverter';

async function versionConverter(content: string, filename: string): Promise<string> {
  const extension = filename.substring(filename.lastIndexOf('.'));
  return convertFileVersion(content, extension);
}

export function SgctVersionConverter() {
  return (
    <Card shadow={'sm'} padding={'md'} radius={'md'} withBorder>
      <Title order={2} mb={'xs'}>
        SGCT Configuration Version Converter
      </Title>
      <Text mb={'xs'}>
        This converter is used to update SGCT configuration files from older versions to
        the newest supported version.
      </Text>
      <FileConverter convert={versionConverter} accept={'.xml,.json'} />
    </Card>
  );
}
