import { useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput
} from '@mantine/core';

import type { OsTest, TestCommand } from '../util/testwizard/types';
import { useOpenSpace } from '../util/testwizard/useOpenSpace';

import { AddCommandForm } from './AddCommandForm';
import { CollapsibleCard } from './CollapsibleCard';

function commandLabel(cmd: TestCommand): string {
  switch (cmd.type) {
    case 'screenshot':
      return 'Screenshot';
    case 'wait':
      return `Wait ${cmd.value}s`;
    case 'deltatime':
      return `Delta time: ${cmd.value}`;
    case 'pause':
      return `Pause: ${cmd.value ? 'on' : 'off'}`;
    case 'script':
      return `Script: ${cmd.value}`;
    case 'time':
      return `Time: ${cmd.value}`;
    case 'asset':
      return `Asset: ${cmd.value}`;
    case 'action':
      return `Action: ${cmd.value}`;
    case 'property':
      return `Property: ${cmd.value.property} = ${String(cmd.value.value)}`;
    case 'navigationstate':
      return `Navigation state (anchor: ${cmd.value.anchor})`;
    default:
      throw new Error(`Unhandled command type: ${cmd}`);
  }
}

function downloadTest(test: OsTest, name: string): void {
  const json = `${JSON.stringify(test, null, 2)}\n`;
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name || 'test'}.ostest`;
  a.click();
  URL.revokeObjectURL(url);
}

export function TestWizard() {
  const { status, library, getProperty, connect, disconnect } = useOpenSpace();
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState<number | string>(4682);
  const [profile, setProfile] = useState('');
  const [name, setName] = useState('');
  const [commands, setCommands] = useState<TestCommand[]>([]);

  async function fetchProfile() {
    if (!library) return;
    const p = await library.profileName();
    const slashIdx = p.lastIndexOf('/');
    const dotIdx = p.indexOf('.');
    const trimmed = p.slice(slashIdx + 1, dotIdx !== -1 ? dotIdx : undefined);
    setProfile(trimmed);
  }

  function handleAdd(cmd: TestCommand) {
    setCommands((prev) => [...prev, cmd]);
  }

  function handleRemove(index: number) {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setCommands((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      if (!item) return prev;
      next.splice(index - 1, 0, item);
      return next;
    });
  }

  function handleMoveDown(index: number) {
    setCommands((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      if (!item) return prev;
      next.splice(index + 1, 0, item);
      return next;
    });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLoadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const test = JSON.parse(ev.target?.result as string) as OsTest;
        setProfile(test.profile ?? '');
        const cmds = test.commands.filter((c) => c.type !== 'screenshot');
        setCommands(cmds);
        const fileName = file.name.replace(/\.ostest$/i, '');
        setName(fileName);
      } catch {
        // ignore malformed files
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleDownload() {
    const test: OsTest = {
      profile,
      commands: [...commands, { type: 'screenshot' }]
    };
    downloadTest(test, name);
  }

  return (
    <CollapsibleCard title={'Test Wizard'}>
      <Text mb={'xs'}>
        Create OpenSpace visual regression test files by selecting a sequence of commands.
        The resulting <code>.ostest</code> file can be run by the OpenSpace test framework
        to verify that the application renders correctly.
      </Text>

      {/* ── Connection panel ── */}
      <Stack gap={'xs'} mb={'md'}>
        <Group gap={'xs'}>
          <TextInput
            label={'Host'}
            value={host}
            onChange={(e) => setHost(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <NumberInput
            label={'Port'}
            value={port}
            onChange={setPort}
            min={1}
            max={65535}
            style={{ width: 100 }}
          />
          {status === 'disconnected' || status === 'error' ? (
            <Button
              mt={'md'}
              onClick={() =>
                connect(host, typeof port === 'number' ? port : Number(port))
              }
            >
              Connect
            </Button>
          ) : (
            <Button mt={'md'} variant={'light'} color={'red'} onClick={disconnect}>
              Disconnect
            </Button>
          )}
          <Badge
            mt={'md'}
            color={
              status === 'connected'
                ? 'green'
                : status === 'connecting'
                  ? 'yellow'
                  : status === 'error'
                    ? 'red'
                    : 'gray'
            }
          >
            {status}
          </Badge>
        </Group>
        {status === 'error' && (
          <Alert color={'red'} variant={'light'}>
            Could not connect to OpenSpace. Make sure OpenSpace is running and the server
            module is enabled.
          </Alert>
        )}
      </Stack>

      <Group grow>
        <Group align={'flex-end'} gap={'xs'}>
          <TextInput
            style={{ flex: 1 }}
            label={'Profile'}
            placeholder={'default'}
            value={profile}
            onChange={(e) => setProfile(e.currentTarget.value)}
          />
          <Button
            size={'sm'}
            variant={'light'}
            disabled={!library}
            onClick={() => void fetchProfile()}
            mb={'xs'}
          >
            Fetch
          </Button>
        </Group>
        <TextInput
          label={'Test name'}
          placeholder={'my_test'}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </Group>

      <Divider label={'Commands'} labelPosition={'left'} />

      <Stack gap={'xs'}>
        {commands.length === 0 && (
          <Text c={'dimmed'} size={'sm'}>
            No commands added yet. A screenshot command will be appended automatically.
          </Text>
        )}
        {commands.map((cmd, i) => (
          <Paper key={i} withBorder p={'xs'}>
            <Group justify={'space-between'}>
              <Text size={'sm'}>{commandLabel(cmd)}</Text>
              <Group gap={'xs'}>
                <Button
                  size={'xs'}
                  variant={'subtle'}
                  onClick={() => handleMoveUp(i)}
                  disabled={i === 0}
                >
                  ↑
                </Button>
                <Button
                  size={'xs'}
                  variant={'subtle'}
                  onClick={() => handleMoveDown(i)}
                  disabled={i === commands.length - 1}
                >
                  ↓
                </Button>
                <Button
                  size={'xs'}
                  variant={'subtle'}
                  color={'red'}
                  onClick={() => handleRemove(i)}
                >
                  ×
                </Button>
              </Group>
            </Group>
          </Paper>
        ))}
        <Paper withBorder p={'xs'}>
          <Text size={'sm'} c={'dimmed'} fs={'italic'}>
            Screenshot (added automatically)
          </Text>
        </Paper>
      </Stack>

      <Divider label={'Add command'} labelPosition={'left'} />

      <AddCommandForm library={library} getProperty={getProperty} onAdd={handleAdd} />

      <input
        ref={fileInputRef}
        type={'file'}
        accept={'.ostest'}
        style={{ display: 'none' }}
        onChange={handleLoadFile}
      />
      <Group grow>
        <Button color={'teal'} onClick={handleDownload} disabled={!profile || !name}>
          Download .ostest
        </Button>
        <Button
          color={'violet'}
          variant={'light'}
          onClick={() => fileInputRef.current?.click()}
        >
          Load .ostest
        </Button>
      </Group>
    </CollapsibleCard>
  );
}
