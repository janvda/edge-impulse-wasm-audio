
// Load the inferencing WebAssembly module
const Module = require('./edge-impulse-standalone');

// Classifier module
let classifierInitialized = false;
Module.onRuntimeInitialized = function() {
    classifierInitialized = true;
};

class EdgeImpulseClassifier {
    _initialized = false;

    init() {
        if (classifierInitialized === true) return Promise.resolve();

        return new Promise((resolve) => {
            Module.onRuntimeInitialized = () => {
                resolve();
                classifierInitialized = true;
            };
        });
    }

    classify(rawData, debug = false) {
        if (!classifierInitialized) throw new Error('Module is not initialized');

        const obj = this._arrayToHeap(rawData);
        let ret = Module.run_classifier(obj.buffer.byteOffset, rawData.length, debug);
        Module._free(obj.ptr);

        if (ret.result !== 0) {
            throw new Error('Classification failed (err code: ' + ret.result + ')');
        }

        let jsResult = {
            anomaly: ret.anomaly,
            results: []
        };

        for (let cx = 0; cx < ret.classification.size(); cx++) {
            let c = ret.classification.get(cx);
            jsResult.results.push({ label: c.label, value: c.value });
        }

        return jsResult;
    }

    _arrayToHeap(data) {
        let typedArray = new Float32Array(data);
        let numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
        let ptr = Module._malloc(numBytes);
        let heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
        heapBytes.set(new Uint8Array(typedArray.buffer));
        return { ptr: ptr, buffer: heapBytes };
    }
}

if (!process.argv[2]) {
    return console.error('Requires one parameter (a comma-separated list of raw features)');
}

// Initialize the classifier, and invoke with the argument passed in
let classifier = new EdgeImpulseClassifier();
classifier.init().then(() => {
    let classify_input = process.argv[3].trim().split(',').map(n => Number(n));
    let result = null;
    for (i=0; i < Number(process.argv[2]); i++) {
       if ((i % 5000) == 0) {
        console.log("\nRan classifier "  + i  + " times and memory usage is :");
        // see https://www.valentinog.com/blog/node-usage/
        const used = process.memoryUsage();
        for (let key in used) {
          console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
        }
       }
       result = classifier.classify(classify_input);
    }

    console.log("Ran classifier "  + i + " times and last classification = \n");
    console.log(result);
}).catch(err => {
    console.error('Failed to initialize classifier', err);
});
