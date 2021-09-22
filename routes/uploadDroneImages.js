const multer = require('multer');
const extract = require('extract-zip');
const path = require('path');
 


const extractZipDrone = async (a,b) => {
  try{
  let c = await a+'/'+b;
  let sP = path.resolve(c);
  let dP = path.resolve(a);
  console.log(a);
  console.log(b);
  console.log(c);
  await extract(sP, { dir: dP });
  console.log('Extraction complete');
  }catch(err){console.log(err)}
};

module.exports = { extractZipDrone };