import { useCallback, useEffect, useState } from 'react';
import { Alert, Anchor, Button, FileInput, Group, Stack, Text } from '@mantine/core';

import { readFile } from '../util/sgct/helper';

type ConverterFn = (content: string, filename: string) => Promise<string>;

interface Props {
  convert: ConverterFn;
  accept: string;
}

export function FileConverter({ convert, accept }: Props) {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleFileChange = useCallback((selected: File | null) => {
    setInputFile(selected);
    setFile(null);
    setObjectUrl(null);
    setError(undefined);
  }, []);

  const handleApply = useCallback(async () => {
    if (!inputFile) {
      return;
    }
    setLoading(true);
    setFile(null);
    setObjectUrl(null);
    setError(undefined);
    try {
      const content = await readFile(inputFile);
      const baseName = inputFile.name.substring(0, inputFile.name.lastIndexOf('.'));
      const convertedContent = await convert(content, inputFile.name);
      const convertedFile = new File([convertedContent], `${baseName}.json`, {
        type: 'application/json'
      });
      setFile(convertedFile);
      setObjectUrl(URL.createObjectURL(convertedFile));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [convert, inputFile]);

  return (
    <Stack mt={'sm'}>
      <Group align={'flex-end'}>
        <FileInput
          flex={1}
          onChange={handleFileChange}
          accept={accept}
          placeholder={'Select file...'}
        />
        <Button onClick={handleApply} disabled={!inputFile} loading={loading}>
          Apply
        </Button>
      </Group>
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
