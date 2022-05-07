const img = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const startButton = document.getElementById('startPrediction');
const clearButton = document.getElementById('clearPrediction');

var model = undefined;

cocoSsd.load().then((loadedModel) => {
  model = loadedModel;
  demosSection.classList.remove('invisible');
});

var children = [];
var reqId;
var cancelAnimationFrame = window.cancelAnimationFrame;

function predictWebcam() {
  model.detect(img).then((predictions) => {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);

    for (let n = 0; n < predictions.length; n++) {
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }

    // Call this function again to keep predicting when the browser is ready.
    reqId = window.requestAnimationFrame(predictWebcam);
  });
}

startButton.addEventListener('click', predictWebcam);
clearButton.addEventListener('click', () => {
  cancelAnimationFrame(reqId);
});