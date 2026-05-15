import { useCallback, useEffect, useState } from 'react';
import { Alert, Anchor, FileInput, Stack, Text } from '@mantine/core';

import { readFile } from '../util/helper';

type ConverterFn = (content: string, filename: string) => Promise<string>;

interface Props {
  convert: ConverterFn;
  accept: string;
}

export function FileConverter({ convert, accept }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = useCallback(
    async (inputFile: File | null) => {
      setFile(null);
      setError(undefined);

      if (!inputFile) {
        return;
      }
      try {
        const content = await readFile(inputFile);
        const baseName = inputFile.name.substring(0, inputFile.name.lastIndexOf('.'));
        const convertedContent = await convert(content, inputFile.name);
        const convertedFile = new File([convertedContent], `${baseName}.json`, {
          type: 'application/json'
        });
        setFile(convertedFile);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [convert]
  );

  return (
    <Stack mt={'sm'}>
      <FileInput
        onChange={handleFileChange}
        accept={accept}
        placeholder={'Select file...'}
      />
      {objectUrl && file && (
        <Anchor download={file.name} href={objectUrl}>
          Download: {file.name}
        </Anchor>
      )}
      {error && (
        <Alert color={'red'} title={'Fatal error while converting'}>
          {error}
        </Alert>
      )}
      <Text size={'sm'} c={'dimmed'}>
        If the converted file does not load, please let us know by creating an issue on{' '}
        <Anchor
          href={
            'https://github.com/OpenSpace/OpenSpace/issues/new?labels=Type%3A+Bug&title=SGCT%20Config%20Converter%20Error'
          }
        >
          GitHub
        </Anchor>{' '}
        or via <Anchor href={'mailto:support@openspaceproject.com'}>mail</Anchor>
      </Text>
    </Stack>
  );
}
