import {test} from 'node:test';
import assert from 'node:assert/strict';
import {videoRange} from '../video-range.mjs';

test('video byte ranges support full, open-ended, suffix and clamped requests',()=>{
 assert.deepEqual(videoRange(undefined,100),{start:0,end:99,partial:false});
 assert.deepEqual(videoRange('bytes=10-19',100),{start:10,end:19,partial:true});
 assert.deepEqual(videoRange('bytes=90-',100),{start:90,end:99,partial:true});
 assert.deepEqual(videoRange('bytes=-10',100),{start:90,end:99,partial:true});
 assert.deepEqual(videoRange('bytes=90-200',100),{start:90,end:99,partial:true});
 assert.deepEqual(videoRange('bytes=-200',100),{start:0,end:99,partial:true});
});
test('video byte ranges reject unsatisfiable and unsupported requests',()=>{
 for(const header of ['bytes=100-','bytes=20-10','bytes=-0','bytes=-','bytes=1-2,4-5','garbage','bytes=9007199254740992-'])assert.equal(videoRange(header,100),null);
 assert.equal(videoRange(undefined,0),null);
});
