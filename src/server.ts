import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  app.get("/filteredimage", async (request : express.Request, result : express.Response) => {
    const { image_url } : { image_url : string } = request.query
    try{
  
    if(image_url.length == 0){
      return result.status(400).send("image url not found")
    }
  
  //    2. call filterImageFromURL(image_url) to filter the image
  
   else{


      const filteredImagePath  = await filterImageFromURL(image_url)
      
  //    3. send the resulting file in the response
      return result.sendFile(filteredImagePath, async () => {

        //    4. deletes any files on the server on finish of the response
        await deleteLocalFiles([filteredImagePath])
        return result.status(200).send("successfull")
          })
         
     }
     
    }
  
  catch (error){
    return result.status(422).send("problem with image url. Kindly use a valid url and try again!")
  }
})

 
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( request : express.Request, result : express.Response ) => {
    result.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();