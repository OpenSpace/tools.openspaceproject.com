export type Vec3 = [number, number, number];

export interface NavigationStateValue {
  anchor: string;
  position: Vec3;
  aim?: string;
  pitch?: number;
  referenceFrame?: string;
  up?: Vec3;
  yaw?: number;
  timestamp?: string;
}

export interface PropertyCommandValue {
  property: string;
  value: string | number | boolean;
}

export type TestCommand =
  | { type: 'navigationstate'; value: NavigationStateValue }
  | { type: 'asset'; value: string }
  | { type: 'property'; value: PropertyCommandValue }
  | { type: 'wait'; value: number }
  | { type: 'script'; value: string }
  | { type: 'time'; value: string }
  | { type: 'pause'; value: boolean }
  | { type: 'deltatime'; value: number }
  | { type: 'action'; value: string }
  | { type: 'screenshot' };

export interface OsTest {
  profile: string;
  commands: TestCommand[];
}
