import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadeImageCloudinary =async (image) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadeImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({folder : "image"}, (error, uploadeResult) => {
            return resolve(uploadeResult)

        }).end(buffer)
    })

    return uploadeImage

}

export default uploadeImageCloudinary;