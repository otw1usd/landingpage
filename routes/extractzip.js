const extract = require('extract-zip')
 
async function extractzip (source,target) {
  try {
    await extract(source, { dir: target })
    console.log('Extraction complete')
  } catch (err) {
    // handle any errors
  }
}

module.exports = { extractzip };


