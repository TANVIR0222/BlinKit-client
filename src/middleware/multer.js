import multer from 'multer'

const storage = multer.memoryStorage();

const uploade = multer({storage : storage})

export default uploade;