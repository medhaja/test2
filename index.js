var player = document.getElementById("player");
      var captureButton = document.getElementById("capture");
      var stopButton = document.getElementById("stop");

      var handleSuccess = function (stream) {
        player.srcObject = stream;
      };

      navigator.mediaDevices.getUserMedia({ video: true }).then(handleSuccess);

      stopButton.addEventListener("click", function () {
        stream = player.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function (track) {
          track.stop();
        });
        player.srcObject = null;
      });
      captureButton.addEventListener("click", async function () {
        // Load the model.
        // net = await mobilenet.load();
        const ASSETS_URL = `${window.location.origin}`
        const WEIGHTS_URL = `${ASSETS_URL}/Weights/model.json`
        net = await tf.loadLayersModel(WEIGHTS_URL);
        console.log('Model loaded!!');


        // Create an object from Tensorflow.js data API which could capture image
        // from the web camera as Tensor.
        const webcam = await tf.data.webcam(player, {
          resizeWidth: 224,
          resizeHeight: 224,
        });
        

        const img = await webcam.capture();



        const result = await net.predict(img.expandDims())
        // function for geting the largest floating element index from array
        function getIndexOfMax(arr) {
          if (arr.length === 0) {
            return -1;
          }

          var max = arr[0];
          var maxIndex = 0;

          for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
              maxIndex = i;
              max = arr[i];
            }
          }

          return maxIndex;
        }
        // get the index of the largest element in the array
        let index = getIndexOfMax(result.dataSync());
        let label = result.dataSync()[index];
        // console.log(label);
        let labelName = ['coco cola', 'power bar']
        let resultLabel = `${labelName[index]}`;
        console.log(resultLabel);
        // display in the html
        document.getElementById('console').innerHTML = resultLabel;
        // add bold test to the label
        document.getElementById('console').style.fontWeight = 'bold';
        // add color to the label
        document.getElementById('console').style.color = 'red';
        // add padding to the label
        document.getElementById('console').style.padding = '10px';
        // add margin to the label
        document.getElementById('console').style.margin = '10px';
        // add font size to the label
        document.getElementById('console').style.fontSize = '20px';
        // add font family to the label
        document.getElementById('console').style.fontFamily = 'Arial';
        // add font weight to the label
        document.getElementById('console').style.fontWeight = 'bold';
        // add text align to the label
        document.getElementById('console').style.textAlign = 'center';
        // add text transform to the label
        document.getElementById('console').style.textTransform = 'uppercase';
        // add text shadow to the label
        document.getElementById('console').style.textShadow = '1px 1px 1px yellow';

        //  var x = document.getElementById("myLabel"); 


        img.dispose();
      });
