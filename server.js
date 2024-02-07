import app from './app.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config( { path: './config/config.env' } );

// app.post("/", (req, res) => {
//   res.send("Hello World");
// });


cloudinary.v2.config( {
  cloud_name: process.env.CLOUDINARY_CLINT_NAME,
  api_key: process.env.CLOUDINARY_CLINT_API,
  api_secret: process.env.CLOUDINARY_CLINT_SECRET
} );

app.listen( process.env.PORT || 4000, () => {
  console.log( 'Server listening on port 4000 ' );
} );


