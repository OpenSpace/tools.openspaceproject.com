import { useState } from 'react';
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import type { OpenSpaceLibrary } from 'openspace-api-js/types';

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
  { value: 'action', label: 'Action' }
];

const COMMAND_DESCRIPTIONS: Record<string, string> = {
  navigationstate:
    'Stores the current camera position (and optionally the time). Restores it when the test is run.',
  asset: 'Causes the test to load a specific asset file.',
  property:
    'Stores a property value. When run, the property will be set to the stored value.',
  wait: 'Causes the test to wait for a specified number of seconds before proceeding.',
  script: 'A Lua script that will be executed during the regression test.',
  time: 'Stores the in-game time and restores it when the test is run.',
  pause: 'Pauses or resumes simulation time.',
  deltatime: 'Sets the simulation delta time when the test is run.',
  action: 'Triggers a registered action.'
};

function parseVec3(s: string): Vec3 | null {
  const parts = s.split(',').map((p) => Number(p.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [x, y, z] = parts;
  if (x === undefined || y === undefined || z === undefined) return null;
  return [x, y, z];
}

type Vec3 = [number, number, number];

interface OsNavState {
  Anchor: string;
  Position: Vec3;
  Aim?: string;
  Pitch?: number;
  ReferenceFrame?: string;
  Timestamp?: string;
  Up?: Vec3;
  Yaw?: number;
}

interface OsAction {
  Identifier: string;
  Name: string;
}

interface Props {
  library: OpenSpaceLibrary | null;
  getProperty: (uri: string) => Promise<unknown>;
  onAdd: (command: TestCommand) => void;
}

export function AddCommandForm({ library, getProperty, onAdd }: Props) {
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

  // live-fetch state
  const [fetching, setFetching] = useState(false);
  const [assetOptions, setAssetOptions] = useState<string[]>([]);
  const [actionOptions, setActionOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  async function fetchNavState() {
    if (!library) return;
    setFetching(true);
    try {
      const navstate = (await library.navigation.getNavigationState()) as OsNavState;
      setNavAnchor(navstate.Anchor);
      setNavPosition(navstate.Position.join(', '));
      if (navstate.Aim !== undefined) setNavAim(navstate.Aim);
      if (navstate.Pitch !== undefined) setNavPitch(navstate.Pitch);
      if (navstate.ReferenceFrame !== undefined) setNavRefFrame(navstate.ReferenceFrame);
      if (navstate.Up !== undefined) setNavUp(navstate.Up.join(', '));
      if (navstate.Yaw !== undefined) setNavYaw(navstate.Yaw);
      if (navstate.Timestamp !== undefined) {
        setNavTimestamp(navstate.Timestamp);
        setNavIncludeTimestamp(true);
      }
    } finally {
      setFetching(false);
    }
  }

  async function fetchTime() {
    if (!library) return;
    setFetching(true);
    try {
      setStrValue(await library.time.UTC());
    } finally {
      setFetching(false);
    }
  }

  async function fetchDeltaTime() {
    if (!library) return;
    setFetching(true);
    try {
      setNumValue(await library.time.deltaTime());
    } finally {
      setFetching(false);
    }
  }

  async function fetchPropertyValue() {
    if (!propUri) return;
    setFetching(true);
    try {
      const result = (await getProperty(propUri)) as {
        type: string;
        value: { value: unknown };
      };
      if (result.type === 'property') {
        setPropRawValue(String(result.value.value));
      }
    } finally {
      setFetching(false);
    }
  }

  async function fetchAssets() {
    if (!library) return;
    setFetching(true);
    try {
      const folder = await library.absPath('${ASSETS}');
      const rawAssets = await library.asset.rootAssets();
      const all = Object.values(rawAssets as Record<number, string>);
      const names = all
        .map((a) => {
          const relative = a.startsWith(folder) ? a.slice(folder.length + 1) : a;
          const dotIdx = relative.indexOf('.');
          return (dotIdx !== -1 ? relative.slice(0, dotIdx) : relative).replace(
            /\\/g,
            '/'
          );
        })
        .sort();
      setAssetOptions(names);
      const [first] = names;
      if (first) setStrValue(first);
    } finally {
      setFetching(false);
    }
  }

  async function fetchActions() {
    if (!library) return;
    setFetching(true);
    try {
      const rawActions = await library.action.actions();
      const actions = Object.values(rawActions as Record<number, OsAction>);
      const opts = actions.map((a) => ({
        value: a.Identifier,
        label: `${a.Name} (${a.Identifier})`
      }));
      setActionOptions(opts);
      const [first] = opts;
      if (first) setStrValue(first.value);
    } finally {
      setFetching(false);
    }
  }

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
          if (!v) return;
          setType(v);
          setStrValue('');
          setNumValue(0);
          setAssetOptions([]);
          setActionOptions([]);
        }}
        allowDeselect={false}
      />
      <Text size={'sm'} c={'dimmed'}>
        {COMMAND_DESCRIPTIONS[type] ?? ''}
      </Text>

      {(type === 'wait' || type === 'deltatime') && (
        <Stack gap={'xs'}>
          <NumberInput
            label={type === 'wait' ? 'Seconds' : 'Delta time'}
            value={numValue}
            onChange={setNumValue}
            min={0}
            step={type === 'wait' ? 1 : 0.1}
          />
          {type === 'deltatime' && (
            <Button
              size={'xs'}
              variant={'light'}
              onClick={() => void fetchDeltaTime()}
              disabled={!library}
              loading={fetching}
            >
              Fetch from OpenSpace
            </Button>
          )}
        </Stack>
      )}

      {type === 'asset' && (
        <Stack gap={'xs'}>
          {assetOptions.length > 0 ? (
            <Select
              label={'Asset'}
              data={assetOptions}
              value={strValue}
              onChange={(v) => {
                if (v) setStrValue(v);
              }}
              searchable
            />
          ) : (
            <TextInput
              label={'Asset path'}
              placeholder={'scene/solarsystem/planets/earth/earth'}
              value={strValue}
              onChange={(e) => setStrValue(e.currentTarget.value)}
            />
          )}
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => void fetchAssets()}
            disabled={!library}
            loading={fetching}
          >
            Load assets from OpenSpace
          </Button>
        </Stack>
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
        <Stack gap={'xs'}>
          <TextInput
            label={'UTC time'}
            placeholder={'2021-01-01T00:00:00'}
            value={strValue}
            onChange={(e) => setStrValue(e.currentTarget.value)}
          />
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => void fetchTime()}
            disabled={!library}
            loading={fetching}
          >
            Fetch from OpenSpace
          </Button>
        </Stack>
      )}

      {type === 'action' && (
        <Stack gap={'xs'}>
          {actionOptions.length > 0 ? (
            <Select
              label={'Action'}
              data={actionOptions}
              value={strValue}
              onChange={(v) => {
                if (v) setStrValue(v);
              }}
              searchable
            />
          ) : (
            <TextInput
              label={'Action identifier'}
              placeholder={'profile.action.identifier'}
              value={strValue}
              onChange={(e) => setStrValue(e.currentTarget.value)}
            />
          )}
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => void fetchActions()}
            disabled={!library}
            loading={fetching}
          >
            Load actions from OpenSpace
          </Button>
        </Stack>
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
          <Group align={'flex-end'} gap={'xs'}>
            <TextInput
              style={{ flex: 1 }}
              label={'Value'}
              description={'Enter true/false for booleans, a number, or a string value.'}
              placeholder={'true'}
              value={propRawValue}
              onChange={(e) => setPropRawValue(e.currentTarget.value)}
            />
            <Button
              size={'sm'}
              variant={'light'}
              onClick={() => void fetchPropertyValue()}
              disabled={!propUri}
              loading={fetching}
              mb={'xs'}
            >
              Fetch value
            </Button>
          </Group>
        </Stack>
      )}

      {type === 'navigationstate' && (
        <Stack gap={'xs'}>
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => void fetchNavState()}
            disabled={!library}
            loading={fetching}
          >
            Fetch current camera state from OpenSpace
          </Button>
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
