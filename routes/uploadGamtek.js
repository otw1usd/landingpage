const { fromPath } = require("pdf2pic");
const pdf = require("pdf-page-counter");
const fs = require("fs");

const filedirlength = async (dir) => {
    fs.readdir(dir, (err, files) => {
    console.log(files.length);
  });
};


const PDFtoPNG = async (a,b)=> {
  console.log(a+'    '+b);
    const { filename } = b;
    const options = {
        saveFilename: 'untitled',
        savePath: a,
        format: "png"
    };
    const c = a+'/'+b;
    const storeAsImage = fromPath(
        c,
        options
    );
    let dataBuffer = fs.readFileSync(
        c
    );
    await pdf(dataBuffer).then(function (data) {
        for (
            var pageToConvertAsImage = 1;
            pageToConvertAsImage <= data.numpages;
            pageToConvertAsImage++
        ) {
            storeAsImage(pageToConvertAsImage).then((resolve) => {
                return resolve;
            });
        };
    });
  };

module.exports = { PDFtoPNG };