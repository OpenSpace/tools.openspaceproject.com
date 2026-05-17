import { useState } from 'react';
import { Button, Divider, Group, Paper, Stack, Text, TextInput } from '@mantine/core';

import type { OsTest, TestCommand } from '../util/testwizard/types';

import { CollapsibleCard } from './CollapsibleCard';
import { AddCommandForm } from './AddCommandForm';

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
  const [profile, setProfile] = useState('');
  const [name, setName] = useState('');
  const [commands, setCommands] = useState<TestCommand[]>([]);

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

  function handleDownload() {
    const test: OsTest = {
      profile,
      commands: [...commands, { type: 'screenshot' }],
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
      <Group grow>
        <TextInput
          label={'Profile'}
          placeholder={'default'}
          value={profile}
          onChange={(e) => setProfile(e.currentTarget.value)}
        />
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

      <AddCommandForm onAdd={handleAdd} />

      <Button onClick={handleDownload} disabled={!profile || !name} fullWidth>
        Download .ostest
      </Button>
    </CollapsibleCard>
  );
}
