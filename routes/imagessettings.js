const Jimp = require("jimp");

const LOGO = "./public/images/logo-amati-navbar-01.png";

const LOGO_MARGIN_PERCENTAGE = 5;

const main = async (ORIGINAL_IMAGE) => {
  const [image, logo] = await Promise.all([
    Jimp.read(ORIGINAL_IMAGE),
    Jimp.read(LOGO)
  ]);

  logo.resize(image.bitmap.width / 5, Jimp.AUTO);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  return image.composite(logo, X, Y, [
    {
      mode: Jimp.BLEND_SCREEN,
      opacitySource: 0.1,
      opacityDest: 1
    }
  ]);
};

const watermarklogo = async(a)=>{
  main(a).then(image => {
    image
    .rotate(90)
    .write(a);
  });
};

const profilepictureresize = async (a) => {
Jimp.read(a, (err, lenna) => {
  if (err) throw err;
  lenna
    .resize(256, 256) // resize
    .quality(60) // set JPEG quality
    .write(a); // save
});
};

const fieldphotoresize = async (a,b) => {
  const fieldphotodest = a + '/' + b;
  const fieldphotocompresed = a + '/compressedfieldphoto/'+b
  Jimp.read(fieldphotodest, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(400, 520 ) // resize
      .rotate(90)
      .quality(60) // set JPEG quality
      .write(fieldphotocompresed); // save
  });
  };

const textOverlay = async(a)=> {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const image = await Jimp.read(a);
  console.log(image._exif.tags.DateTimeOriginal);

  image.print(font, 10, 10, 'OMGGGGGG');
};


module.exports={ watermarklogo, profilepictureresize, textOverlay, fieldphotoresize};


// window.onload=getExif;
 
// function getExif() {
//     var img1 = document.getElementById("img1");
//     EXIF.getData(img1, function() {
//         var make = EXIF.getTag(this, "Make");
//         var model = EXIF.getTag(this, "Model");
//         var makeAndModel = document.getElementById("makeAndModel");
//         makeAndModel.innerHTML = `${make} ${model}`;
//     });
 
//     var img2 = document.getElementById("img2");
//     EXIF.getData(img2, function() {
//         var allMetaData = EXIF.getAllTags(this);
//         var allMetaDataSpan = document.getElementById("allMetaDataSpan");
//         allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
//     });
// };


 
