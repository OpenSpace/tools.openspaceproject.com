import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Link } from '@mui/material';

import { convertFileMPCDI, convertFileVersion } from './converters';
import { readFile } from './helper';

type ConverterFn = (content: string, filename: string) => Promise<string>;

async function versionConverter(content: string, filename: string): Promise<string> {
  const extension = filename.substring(filename.lastIndexOf('.'));
  return convertFileVersion(content, extension);
}

interface FileConverterProps {
  convert: ConverterFn;
  accept: string;
}

function FileConverter({ convert, accept }: FileConverterProps) {
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
    async (e: ChangeEvent<HTMLInputElement>) => {
      setFile(null);
      setError(undefined);

      const { files } = e.target;
      if (!files || files.length === 0) {
        return;
      }

      const [inputFile] = files;
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
    <div>
      <input type={'file'} onChange={handleFileChange} accept={accept} />
      <div>
        {objectUrl && file && (
          <a download={file.name} href={objectUrl}>
            Download: {file.name}
          </a>
        )}
      </div>
      {error && (
        <div>
          Fatal error while converting: <br /> {error}
        </div>
      )}
      <div className={'note'}>
        If the converted file does not load, please let us know by creating an issue on{' '}
        <Link
          href={
            'https://github.com/OpenSpace/OpenSpace/issues/new?labels=Type%3A+Bug&title=SGCT%20Config%20Converter%20Error'
          }
        >
          GitHub
        </Link>{' '}
        or via <Link href={'mailto:support@openspaceproject.com'}>mail</Link>
      </div>
    </div>
  );
}

export function SgctConfigVersion() {
  return <FileConverter convert={versionConverter} accept={'.xml,.json'} />;
}

export function SgctConfigMPCDI() {
  return <FileConverter convert={convertFileMPCDI} accept={'.xml'} />;
}
