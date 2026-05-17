import { Text } from '@mantine/core';

import { convertFileVersion } from '../util/sgct/converters';

import { CollapsibleCard } from './CollapsibleCard';
import { FileConverter } from './FileConverter';

async function versionConverter(content: string, filename: string): Promise<string> {
  const extension = filename.substring(filename.lastIndexOf('.'));
  return convertFileVersion(content, extension);
}

export function SgctVersionConverter() {
  return (
    <CollapsibleCard title={'SGCT Configuration Version Converter'}>
      <Text mb={'xs'}>
        This converter is used to update SGCT configuration files from older versions to
        the newest supported version.
      </Text>
      <FileConverter convert={versionConverter} accept={'.xml,.json'} />
    </CollapsibleCard>
  );
}
