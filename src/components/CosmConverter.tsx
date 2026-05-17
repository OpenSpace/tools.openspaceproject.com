import { Text } from '@mantine/core';

import { convertFileMPCDI } from '../util/sgct/converters';

import { CollapsibleCard } from './CollapsibleCard';
import { FileConverter } from './FileConverter';

export function CosmConverter() {
  return (
    <CollapsibleCard title={'COSM configuration file Converter'}>
      <Text mb={'xs'}>
        This converter takes a COSM MPCDI configuration file and converts it into a
        format that can be loaded by SGCT.
      </Text>
      <FileConverter convert={convertFileMPCDI} accept={'.xml'} />
    </CollapsibleCard>
  );
}
