const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: "dth8f91to",
    api_key: "338265352817589",
    api_secret: "qmO5PJq7fQGN-GHhwTb7mdz6Q54",
    secure: true,
});
// cloudinary.config({
//     cloud_name: "dwnvcgdsy",
//     api_key: "527646275241678",
//     api_secret: "xX-ryq_amhTxE78rdfHqO9zZidY",
//     secure: true,
// });


module.exports = { cloudinary };