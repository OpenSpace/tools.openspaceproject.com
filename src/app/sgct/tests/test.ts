import { existsSync, readFileSync } from 'fs';
import { diffString } from 'json-diff';

import { convertFile } from '../converters';

async function runTest(testFile: string, expectedFile: string): Promise<boolean> {
  console.assert(existsSync(testFile), 'Test file not found');
  console.assert(existsSync(expectedFile), 'Expected file not found');

  const testContent = readFileSync(testFile).toString();
  const expectedContent = readFileSync(expectedFile).toString();

  const converted = await convertFile(testContent, testFile);
  const test = JSON.parse(converted);
  const expected = JSON.parse(expectedContent);

  const difference = diffString(test, expected);
  if (difference !== '') {
    console.error(`Error in conversion from ${testFile} to ${expectedFile}`);

    console.log('Difference:', diffString(test, expected));
  }

  return difference === '';
}

// Define the tests
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

// Wait for the tests to finish
Promise.all(results).then((res: boolean[]) => {
  const nTests = res.length;
  const failed = res.filter((v) => v === false);
  const nFailed = failed.length;

  if (nFailed > 0) {
    console.log('\n\n==========');
  }
  console.log(`${nTests - nFailed} tests succeeded out of ${nTests}`);
});
