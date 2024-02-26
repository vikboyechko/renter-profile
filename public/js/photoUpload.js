

const cloudName = 'denr3t4ps'
const uploadPreset = 'profile_picture'





const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
       cropping: true, //add a cropping step
       showAdvancedOptions: true,  //add advanced options (public_id and tag)
       sources: [ "local"], // restrict the upload sources to URL and local files
       multiple: false,  //restrict upload to a single file
       folder: "renterly_users", //upload files to the specified folder
       tags: ['userID'], //add the given tags to the uploaded files
       maxImageFileSize: 2000000,  //restrict file size to less than 2MB
       maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
      
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        document
          .getElementById("uploadedimage")
          .setAttribute("src", result.info.secure_url);
      }
    }
  );
  
  document.getElementById("upload_widget").addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );
  