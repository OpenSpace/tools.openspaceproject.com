import { useState } from 'react';
import {
  Button,
  Checkbox,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';

import type { NavigationStateValue, TestCommand } from '../util/testwizard/types';

const COMMAND_OPTIONS = [
  { value: 'navigationstate', label: 'Navigation State' },
  { value: 'asset', label: 'Asset' },
  { value: 'property', label: 'Property' },
  { value: 'wait', label: 'Wait' },
  { value: 'script', label: 'Script' },
  { value: 'time', label: 'Time' },
  { value: 'pause', label: 'Pause' },
  { value: 'deltatime', label: 'Delta Time' },
  { value: 'action', label: 'Action' },
];

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  navigationstate:
    'Stores the current camera position (and optionally the time). Restores it when the test is run.',
  asset: 'Causes the test to load a specific asset file.',
  property: 'Stores a property value. When run, the property will be set to the stored value.',
  wait: 'Causes the test to wait for a specified number of seconds before proceeding.',
  script: 'A Lua script that will be executed during the regression test.',
  time: 'Stores the in-game time and restores it when the test is run.',
  pause: 'Pauses or resumes simulation time.',
  deltatime: 'Sets the simulation delta time when the test is run.',
  action: 'Triggers a registered action.',
};

function parseVec3(s: string): Vec3 | null {
  const parts = s.split(',').map((p) => Number(p.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [x, y, z] = parts;
  if (x === undefined || y === undefined || z === undefined) return null;
  return [x, y, z];
}

type Vec3 = [number, number, number];

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function AddCommandForm({ onAdd }: Props) {
  const [type, setType] = useState('wait');

  // wait / deltatime
  const [numValue, setNumValue] = useState<number | string>(0);

  // asset / script / time / action
  const [strValue, setStrValue] = useState('');

  // pause
  const [pauseValue, setPauseValue] = useState(true);

  // property
  const [propUri, setPropUri] = useState('');
  const [propRawValue, setPropRawValue] = useState('');

  // navigationstate
  const [navAnchor, setNavAnchor] = useState('');
  const [navPosition, setNavPosition] = useState('');
  const [navAim, setNavAim] = useState('');
  const [navPitch, setNavPitch] = useState<number | string>('');
  const [navRefFrame, setNavRefFrame] = useState('');
  const [navUp, setNavUp] = useState('');
  const [navYaw, setNavYaw] = useState<number | string>('');
  const [navTimestamp, setNavTimestamp] = useState('');
  const [navIncludeTimestamp, setNavIncludeTimestamp] = useState(false);

  function buildCommand(): TestCommand | null {
    switch (type) {
      case 'wait':
        return { type: 'wait', value: Number(numValue) };
      case 'deltatime':
        return { type: 'deltatime', value: Number(numValue) };
      case 'asset':
        return strValue ? { type: 'asset', value: strValue } : null;
      case 'script':
        return strValue ? { type: 'script', value: strValue } : null;
      case 'time':
        return strValue ? { type: 'time', value: strValue } : null;
      case 'action':
        return strValue ? { type: 'action', value: strValue } : null;
      case 'pause':
        return { type: 'pause', value: pauseValue };
      case 'property': {
        if (!propUri) return null;
        let val: string | number | boolean = propRawValue;
        if (propRawValue.toLowerCase() === 'true') val = true;
        else if (propRawValue.toLowerCase() === 'false') val = false;
        else if (propRawValue !== '' && !Number.isNaN(Number(propRawValue)))
          val = Number(propRawValue);
        return { type: 'property', value: { property: propUri, value: val } };
      }
      case 'navigationstate': {
        const position = parseVec3(navPosition);
        if (!navAnchor || !position) return null;
        const value: NavigationStateValue = { anchor: navAnchor, position };
        if (navAim) value.aim = navAim;
        if (typeof navPitch === 'number') value.pitch = navPitch;
        if (navRefFrame) value.referenceFrame = navRefFrame;
        const up = navUp ? parseVec3(navUp) : null;
        if (up) value.up = up;
        if (typeof navYaw === 'number') value.yaw = navYaw;
        if (navIncludeTimestamp && navTimestamp) value.timestamp = navTimestamp;
        return { type: 'navigationstate', value };
      }
      default:
        return null;
    }
  }

  function resetForm() {
    setStrValue('');
    setNumValue(0);
    setPropUri('');
    setPropRawValue('');
    setNavAnchor('');
    setNavPosition('');
    setNavAim('');
    setNavPitch('');
    setNavRefFrame('');
    setNavUp('');
    setNavYaw('');
    setNavTimestamp('');
    setNavIncludeTimestamp(false);
  }

  function handleAdd() {
    const cmd = buildCommand();
    if (!cmd) return;
    onAdd(cmd);
    resetForm();
  }

  return (
    <Stack gap={'sm'}>
      <Select
        label={'Command type'}
        data={COMMAND_OPTIONS}
        value={type}
        onChange={(v) => {
          if (v) setType(v);
        }}
        allowDeselect={false}
      />
      <Text size={'sm'} c={'dimmed'}>
        {COMMAND_DESCRIPTIONS[type] ?? ''}
      </Text>

      {(type === 'wait' || type === 'deltatime') && (
        <NumberInput
          label={type === 'wait' ? 'Seconds' : 'Delta time'}
          value={numValue}
          onChange={setNumValue}
          min={0}
          step={type === 'wait' ? 1 : 0.1}
        />
      )}

      {type === 'asset' && (
        <TextInput
          label={'Asset path'}
          placeholder={'scene/solarsystem/planets/earth/earth'}
          value={strValue}
          onChange={(e) => setStrValue(e.currentTarget.value)}
        />
      )}

      {type === 'script' && (
        <Textarea
          label={'Lua script'}
          placeholder={'openspace.printInfo("Hello")'}
          value={strValue}
          onChange={(e) => setStrValue(e.currentTarget.value)}
          autosize
          minRows={2}
        />
      )}

      {type === 'time' && (
        <TextInput
          label={'UTC time'}
          placeholder={'2021-01-01T00:00:00'}
          value={strValue}
          onChange={(e) => setStrValue(e.currentTarget.value)}
        />
      )}

      {type === 'action' && (
        <TextInput
          label={'Action identifier'}
          placeholder={'profile.action.identifier'}
          value={strValue}
          onChange={(e) => setStrValue(e.currentTarget.value)}
        />
      )}

      {type === 'pause' && (
        <Switch
          label={'Pause simulation'}
          checked={pauseValue}
          onChange={(e) => setPauseValue(e.currentTarget.checked)}
        />
      )}

      {type === 'property' && (
        <Stack gap={'xs'}>
          <TextInput
            label={'Property URI'}
            placeholder={'Scene.Earth.Renderable.Enabled'}
            value={propUri}
            onChange={(e) => setPropUri(e.currentTarget.value)}
          />
          <TextInput
            label={'Value'}
            description={'Enter true/false for booleans, a number, or a string value.'}
            placeholder={'true'}
            value={propRawValue}
            onChange={(e) => setPropRawValue(e.currentTarget.value)}
          />
        </Stack>
      )}

      {type === 'navigationstate' && (
        <Stack gap={'xs'}>
          <TextInput
            label={'Anchor'}
            placeholder={'Earth'}
            value={navAnchor}
            onChange={(e) => setNavAnchor(e.currentTarget.value)}
          />
          <TextInput
            label={'Position (x, y, z)'}
            description={'Comma-separated values'}
            placeholder={'0, 0, 10000000'}
            value={navPosition}
            onChange={(e) => setNavPosition(e.currentTarget.value)}
          />
          <TextInput
            label={'Aim (optional)'}
            placeholder={'Mars'}
            value={navAim}
            onChange={(e) => setNavAim(e.currentTarget.value)}
          />
          <NumberInput
            label={'Pitch (optional)'}
            value={navPitch}
            onChange={setNavPitch}
          />
          <TextInput
            label={'Reference frame (optional)'}
            value={navRefFrame}
            onChange={(e) => setNavRefFrame(e.currentTarget.value)}
          />
          <TextInput
            label={'Up (x, y, z) (optional)'}
            description={'Comma-separated values'}
            placeholder={'0, 1, 0'}
            value={navUp}
            onChange={(e) => setNavUp(e.currentTarget.value)}
          />
          <NumberInput label={'Yaw (optional)'} value={navYaw} onChange={setNavYaw} />
          <Checkbox
            label={'Include timestamp'}
            checked={navIncludeTimestamp}
            onChange={(e) => setNavIncludeTimestamp(e.currentTarget.checked)}
          />
          {navIncludeTimestamp && (
            <TextInput
              label={'Timestamp'}
              placeholder={'2021-01-01T00:00:00'}
              value={navTimestamp}
              onChange={(e) => setNavTimestamp(e.currentTarget.value)}
            />
          )}
        </Stack>
      )}

      <Button onClick={handleAdd}>Add command</Button>
    </Stack>
  );
}
