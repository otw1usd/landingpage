const fs = require('fs');
const getDate = require('../routes/date.js');

const loadMaps = (projectid) =>{
    const fileBuffer = fs.readFileSync('./public/project/'+projectid+'/mapsdata.json','utf-8');
    const jsonparse = JSON.parse(fileBuffer);
    return jsonparse;
};

//edit data zona
const saveZoneData =(b,contents)=>{
    fs.writeFileSync('./public/project/'+b+'/mapsdata.json', JSON.stringify(contents));
};

const addZoneData = (a,data) => {
    const datas = loadMaps(a);
    datas[2].push(data);
    saveZoneData(a,datas);
    const datazoneid = data.zoneid;
    const fieldphotoZoneFolder = './public/project/'+a+'/fieldphoto/'+datazoneid;
    fs.mkdir(fieldphotoZoneFolder, {recursive: true}, err => {});
    datas[1].forEach(async element => {
        const timestampDate= await new Date(element.timestampproject);
        const timestampExist = await getDate.getNumericValue(timestampDate).split("/").join("_");
        const fieldphotodirPath = './public/project/'+a+'/fieldphoto/'+datazoneid+'/'+timestampExist;
        fs.mkdir(fieldphotodirPath, {recursive: true}, err => {});
    });
    const drawingZoneFolder = './public/project/'+a+'/drawing/'+datazoneid;
    fs.mkdir(drawingZoneFolder, {recursive: true}, err => {});

};

const addTimeStamp=(a, data)=>{
    const datas = loadMaps(a);
    datas[1].push(data);
    saveZoneData(a,datas);
    const newTimestamp = getDate.getNumericValue(data.timestampproject).split("/").join("_");
    const dronedirPath = './public/project/'+a+'/drone/'+newTimestamp;
    for (let i = 13; i < 23; i++) {
            const dronedirPathwithZoom = './public/project/'+a+'/drone/'+newTimestamp+'/'+i;
            fs.mkdir(dronedirPathwithZoom, {recursive: true}, err => {});
          };
    fs.mkdir(dronedirPath, {recursive: true}, err => {});
    datas[2].forEach(element => {
        const zoneidExist = element.zoneid;
        const fieldphotodirPath = './public/project/'+a+'/fieldphoto/'+zoneidExist+'/'+newTimestamp;
        fs.mkdir(fieldphotodirPath, {recursive: true}, err => {});
        });
}

const newDataMap = (a,b,c,d) => {
    const dirPath ='./public/project/'+b;
    const droneFolder ='./public/project/'+b+'/drone';
    const fieldphotoFolder = './public/project/'+b+'/fieldphoto';
    const drawingFolder = './public/project/'+b+'/drawing';
    if(!fs.existsSync(dirPath)){
        fs.mkdir(dirPath, {recursive: true}, err => {});
        fs.mkdir(droneFolder, {recursive: true}, err => {});
        fs.mkdir(fieldphotoFolder, {recursive: true}, err => {});
        fs.mkdir(drawingFolder, {recursive: true}, err => {});
    };

    const mapsDataJson = './public/project/'+b+'/mapsdata.json';
    if(!fs.existsSync(mapsDataJson)){
        fs.writeFileSync(mapsDataJson, '[[{"zoomInit":15,"latInit":'+c+',"lngInit":'+d+'}],[],[]]','utf-8');
    };    
};
//yang di export addZoneData aja
module.exports = { loadMaps, addZoneData, newDataMap, addTimeStamp };
