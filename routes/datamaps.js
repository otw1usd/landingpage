const fs = require('fs');

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
    const datas = loadMaps();
    datas.push(data);
    saveZoneData(a,datas);
};
const newDataMap = (a,b) => {
    const dirPath ='./public/project/'+b;
    const droneFolder ='./public/project/drone';
    if(!fs.existsSync(dirPath)){
        fs.mkdir(dirPath, {recursive: true}, err => {});
        fs.mkdir(droneFolder, {recursive: true}, err => {});
    };

    const mapsDataJson = './public/project/'+b+'/mapsdata.json';
    if(!fs.existsSync(mapsDataJson)){
        fs.writeFileSync(mapsDataJson, '[]','utf-8');//bisa diisiin dlu????
    };    
};
//yang di export addZoneData aja
module.exports = { loadMaps, addZoneData, newDataMap };
