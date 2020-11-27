# Description

| file | description |
| -- | -- |
| audio_100ms | 100ms audio fragment 44100 Hz - 16 bit |
| edge-impulse-standalone.js, <br> edge-impulse-standalone.wasm | Is the downloaded float32 webassembly build of my project (ID = 8755)|
| run-impulse.js | runs the impulse only once.  Based on https://docs.edgeimpulse.com/docs/through-webassembly |
| run-impulse-loop.js | runs the impulse classification X times on the same audio input and after every 5000 classifications dumps memory usage |
| run-once.sh | script running `run-impulse.js` for `audio_100ms` |
| run-loop.sh | script running `run-impulse-loop.js` for `audio_100ms`.  The first parameter specifies how many times it should run the classification. |
# command demonstrating that the memory increases

The following command can be used to demonstrate that the memory is increasing.
```
. ./run-loop.sh 500000
```
Output of above command on my macbook:

```
Jans-MBP:doorbell-mel-wasm-v9 jan$ node -v
v12.6.0
Jans-MBP:doorbell-mel-wasm-v9 jan$ . ./run-loop.sh 500000

Ran classifier 0 times and memory usage is :
rss 28.2 MB
heapTotal 5.3 MB
heapUsed 3.12 MB
external 128.86 MB

Ran classifier 5000 times and memory usage is :
rss 37.43 MB
heapTotal 8.1 MB
heapUsed 4.65 MB
external 129.6 MB

Ran classifier 10000 times and memory usage is :
rss 39.34 MB
heapTotal 8.1 MB
heapUsed 2.99 MB
external 128.93 MB

Ran classifier 15000 times and memory usage is :
rss 41.64 MB
heapTotal 8.1 MB
heapUsed 3.35 MB
external 129.06 MB

Ran classifier 20000 times and memory usage is :
rss 43.51 MB
heapTotal 8.1 MB
heapUsed 3.69 MB
external 129.2 MB

Ran classifier 25000 times and memory usage is :
rss 45.39 MB
heapTotal 8.1 MB
heapUsed 4.03 MB
external 129.33 MB

Ran classifier 30000 times and memory usage is :
rss 47.25 MB
heapTotal 8.1 MB
heapUsed 4.36 MB
external 129.47 MB

Ran classifier 35000 times and memory usage is :
rss 49.13 MB
heapTotal 8.1 MB
heapUsed 4.7 MB
external 129.6 MB
```


# Interesting Links

* https://docs.edgeimpulse.com/docs/through-webassembly