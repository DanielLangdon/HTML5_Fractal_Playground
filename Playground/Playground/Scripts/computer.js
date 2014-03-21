﻿(function () {
    'use strict';
    var computationModule, helper, foreign, heap;

    foreign = {};
    // computationModule is computed later by using data from a form.    

    // This is the event handler that receives a command from the main thread to compute the pixel colors for a given row.
    self.addEventListener('message', function (e) {
        switch (e.data.mode) {
            case 'setup':
                setup();
                break;
            case 'computeResult':
                computeResult();
                break;
        }

        function setup() {            
            var code, bufferSize;
            code = e.data.code;
            bufferSize = e.data.canvasWidth * 4;
            heap = new ArrayBuffer(bufferSize);
            computationModule = eval(code);
        }

        function computeResult() {
            var startDt, endDt, result;
            startDt = new Date();
            computationModule.computeRow(e.data.canvasWidth, e.data.canvasHeight, e.data.limit, e.data.max, e.data.rowNumber, e.data.minR, e.data.maxR, e.data.minI, e.data.maxI);
            endDt = new Date();

            result = new Int32Array(heap);

            self.postMessage({
                rowNumber: e.data.rowNumber,
                time: endDt - startDt,
                result: result
            });
        }
    }, false);
})();