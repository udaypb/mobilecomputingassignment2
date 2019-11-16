var express = require('express');
var router = express.Router();
var {Parser}=require('json2csv');
var fs=require('fs');
var spawn=require('child_process').spawn;
var path=require('path')
var os=require('os')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/', function(req, res, next) {
  let data=req.body
    console.log(data);
    let header=`score_overall, nose_score, nose_x, nose_y, leftEye_score,
    leftEye_x, leftEye_y, rightEye_score, rightEye_x, rightEye_y,
    leftEar_score, leftEar_x, leftEar_y, rightEar_score,
    rightEar_x, rightEar_y, leftShoulder_score, leftShoulder_x,
    leftShoulder_y, rightShoulder_score, rightShoulder_x,
    rightShoulder_y, leftElbow_score, leftElbow_x, leftElbow_y,
    rightElbow_score, rightElbow_x, rightElbow_y, leftWrist_score,
    leftWrist_x, leftWrist_y, rightWrist_score, rightWrist_x,
    rightWrist_y, leftHip_score, leftHip_x, leftHip_y,
    rightHip_score, rightHip_x, rightHip_y, leftKnee_score,
    leftKnee_x, leftKnee_y, rightKnee_score, rightKnee_x,
    rightKnee_y, leftAnkle_score, leftAnkle_x, leftAnkle_y,
    rightAnkle_score, rightAnkle_x, rightAnkle_y`;

    let csv ='';
    csv+=header.replace(/(?:\r\n|\r|\n)/g, '').replace(/\s/g, "");
    csv+='\n,';
    data.map(function(d){
      csv=csv.slice(0,csv.length-2);
      csv+='\n';
      csv+=`${d.score},`;
      let frameKeypoints=d.keypoints;
      let keyObj={}
      frameKeypoints.map(function(k){
        keyObj[k.part+'_score']=k.score;
        keyObj[k.part+'_x']=k.position.x;
        keyObj[k.part+'_y']=k.position.y;
      });
      let st=header.split(',');
      st=st.slice(1)
      // console.log('st is ',st)
      // console.log(keyObj)
      st.forEach(function(s){
        let str=s.replace(/\\"/g, '"');
        str=str.trimStart();
        str=str.trimEnd();
        // str = str.slice(1, -1);
        // console.log('str is ',str)
        // console.log('str is ',str);
        csv+=`${keyObj[str]},`;
      });
      
    });
    fs.writeFile('video.csv', csv.slice(0,csv.length-2), (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;
      // fs.end();
      // success case, the file was saved
      console.log('csv saved!');

      runModel('',res);
  });

});

function runModel(param,res){
var process=spawn('python',[path.join(__dirname, '..', 'model_run.py')]);
console.log('process called')
var tostr=function(d){
  return String.fromCharCode.apply(null,d);
}
process.stdout.on('data',function(d){
 d= tostr(d);
  console.log('got back data', d)
  let result={'1':d.split(' ')[0].replace(/(\r\n|\n|\r)/gm, ""),'2':d.split(' ')[1].replace(/(\r\n|\n|\r)/gm, ""),'3':d.split(' ')[2].replace(/(\r\n|\n|\r)/gm, "")}
  res.send(result);
  console.log(result)
});
process.stderr.on('d',function(d){
  console.log(d)
})

process.on('exit',function(d,s){
  console.log(d)
  if(d!=0){
  res.send('error occured');
  } 
  console.log('err:',s)
})

}
module.exports = router;
