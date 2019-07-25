emojis = {
    'neutral':'em-neutral_face',
    'happy':'em-grin',
    'sad':'em-cry',
    'angry':'em-angry',
    'fearful':'em-fearful',
    'disgusted':'em-face_vomiting',
    'surprised':'em-astonished'};
imgUploaded = null;
result = null;
res = null;
rawEle = null;
cenEle = null;
imgSrc = null;
overlay = document.getElementById('overlay');

function callbackLoad() {
    console.log('callback after face detection model is loaded!');
}

// callback after prediction
function callbackPredict(err, results) {
    console.log('callbackPredict!');
    result = results;
    cenEle = document.getElementById('censoredImage');
    cenEle.setAttribute('src', imgSrc);
    cenEle.classList.remove("hide");
    for (i=0; i<result.outputs.length; i++) {
        // console.log('result arr');
        x = result["outputs"][i].detection.box.x;
        y = result["outputs"][i].detection.box.y;
        h = result["outputs"][i].detection.box.height;
        w = result["outputs"][i].detection.box.width;
        overlayCln = overlay.cloneNode(true);
        overlayCln.style.transform="translate("+x+"px,"+y+"px)";
        overlayCln.style.height = h+'px';
        overlayCln.style.width = w+'px';
        // console.log(result["outputs"][i].expressions[0]);
        // console.log(result["outputs"][i].expressions[0].expression);
        exp = result["outputs"][i].expressions[0].expression;
        expscore = result["outputs"][i].expressions[0].probability;
        for(j=0; j<7; j++){
            // console.log('exp arr');
            if(expscore < result["outputs"][i].expressions[j].probability){
                exp = result["outputs"][i].expressions[j].expression;
                expscore = result["outputs"][i].expressions[j].probability;
            }
        }
        // console.log(emojis[exp]);
        overlayCln.classList.add(emojis[exp]);
        overlayCln.classList.remove("hide");
        document.getElementById("ciContainer").appendChild(overlayCln);
    }
}

async function detectFaces(){
    await stackml.init({'accessKeyId': '15e4d1331af8253eaa30c13b65ba7252'});
    // load face detection model
    model = await stackml.faceExpression(callbackLoad);
    // make prediction with the image
    model.detect(rawEle, callbackPredict);
}

function uploadImage(){
    uploadedImage = document.getElementById('uploadImage');
    if (uploadedImage.files && uploadedImage.files[0]) {
        var reader = new FileReader();

        reader.onload = imageIsLoaded;
        reader.readAsDataURL(uploadedImage.files[0]);
    }else{
        console.log("no files");
    }
    detectFaces();
}

function imageIsLoaded(e) {
    rawEle = document.getElementById('rawImage');
    imgSrc = e.target.result;
    imageResizer();

};

function imageResizer(){
    var img = new Image();
    img.src = imgSrc;
    img.onload = function(){
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = canvas.width * (img.height/img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        imgSrc = canvas.toDataURL('image/png');
        rawEle.setAttribute('src', imgSrc);
        rawEle.classList.remove("hide");
    };
}