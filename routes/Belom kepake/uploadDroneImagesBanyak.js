const multer = require('multer');

const DroneImagesStorage13 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/13')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      console.log('cekcekwoi13: '+file.originalname);
    }
  });
  
const uploadDroneImages13 = multer({
    storage: DroneImagesStorage13
});

const DroneImagesStorage14 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/14')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      console.log('cekcekwoi14: '+file.originalname);
    }
  });
  
const uploadDroneImages14 = multer({
    storage: DroneImagesStorage14
});

const DroneImagesStorage15 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/15')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      console.log('cekcekwoi15: '+file.originalname);
    }
  });
  
const uploadDroneImages15 = multer({
    storage: DroneImagesStorage15
});

const DroneImagesStorage16 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/16')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      console.log('cekcekwoi16: '+file.originalname);
    }
  });
  
const uploadDroneImages16 = multer({
    storage: DroneImagesStorage16
});

const DroneImagesStorage17 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/17')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages17 = multer({
    storage: DroneImagesStorage17
});

const DroneImagesStorage18 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/18')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages18 = multer({
    storage: DroneImagesStorage18
});

const DroneImagesStorage19 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/19')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages19 = multer({
    storage: DroneImagesStorage19
});

const DroneImagesStorage20 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/20')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages20 = multer({
    storage: DroneImagesStorage20
});

const DroneImagesStorage21 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/21')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages21 = multer({
    storage: DroneImagesStorage21
});

const DroneImagesStorage22 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/project/'+req.body.projectid+'/drone/'+req.body.timestamp+'/22')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const uploadDroneImages22 = multer({
    storage: DroneImagesStorage22
});


async function uploadDroneImages(req, file, next) {
  console.log(req.file);
 uploadDroneImages13.single('image13')(req, file, function(err){
  if(err instanceof multer.MulterError){
    console.log('errormulter1');
    next();
  } else if (err){
    console.log('errormulter2');
    next();
  }
 });
 uploadDroneImages14.single('image14')(req, file, function(err){
  if(err instanceof multer.MulterError){
    console.log('errormulter1');
    next();
  } else if (err){
    console.log('errormulter2');
    next();
  }
 });
 uploadDroneImages15.single('image15')(req, file, function(err){
  if(err instanceof multer.MulterError){
    console.log('errormulter1');
    next();
  } else if (err){
    console.log('errormulter2');
    next();
  }
 });
 uploadDroneImages16.single('image16')(req, file, function(err){
  if(err instanceof multer.MulterError){
    console.log('errormulter1');
    next();
  } else if (err){
    console.log('errormulter2');
    next();
  }
 });
 await next();
};

  module.exports = { uploadDroneImages };