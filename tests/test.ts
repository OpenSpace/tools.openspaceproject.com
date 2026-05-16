import { diffString } from 'json-diff';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

import { convertFileVersion } from '../src/sgct/converters';

async function runTest(testFile: string, expectedFile: string): Promise<boolean> {
  const testPath = join(__dirname, testFile);
  const expectedPath = join(__dirname, expectedFile);

  console.assert(existsSync(testPath), 'Test file not found');
  console.assert(existsSync(expectedPath), 'Expected file not found');

  const testContent = readFileSync(testPath).toString();
  const expectedContent = readFileSync(expectedPath).toString();

  const converted = await convertFileVersion(testContent, extname(testFile));
  const test = JSON.parse(converted);
  const expected = JSON.parse(expectedContent);

  const difference = diffString(test, expected);
  if (difference !== '') {
    console.error(`Error in conversion from ${testFile} to ${expectedFile}`);
    console.log('Difference:', difference);
  }

  return difference === '';
}

const results = [
  runTest('before/single.xml', 'after/single.json'),
  runTest('before/single_fisheye.xml', 'after/single_fisheye.json'),
  runTest('before/single_fisheye_fxaa.xml', 'after/single_fisheye_fxaa.json'),
  runTest('before/single_sbs_stereo.xml', 'after/single_sbs_stereo.json'),
  runTest('before/single_two_win.xml', 'after/single_two_win.json'),
  runTest('before/spherical_mirror_4meshes.xml', 'after/spherical_mirror_4meshes.json'),
  runTest('before/spherical_mirror.xml', 'after/spherical_mirror.json'),
  runTest('before/two_nodes.xml', 'after/two_nodes.json')
];

void Promise.all(results).then((res: boolean[]) => {
  const nTests = res.length;
  const nFailed = res.filter((v) => !v).length;

  if (nFailed > 0) {
    console.log('\n\n==========');
  }
  console.log(`${nTests - nFailed} tests succeeded out of ${nTests}`);
});
