const mongoose = require("mongoose");
const Campground = require("../models/Campgrounds");
const dbConn = require("../config/dbConn");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

// mongo connection
dbConn();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error : "));
db.once("open", () => {
  console.log("Mongo database connected");
  console.log("Seeding the database");
});

const sample = (array) =>
  array[Math.floor(Math.random() * (array.length - 1)) + 1];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i <= 300; i++) {
    const random = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 20) + 10;
    const newCamp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dlvkf6kgm/image/upload/v1691907297/YelpCamp-remake/wsc4zhehoduupu2k9vj3.jpg",
          filename: "YelpCamp-remake/ekcadoukz9ldzi0ljzpd",
          _id: "64d73f516d3e808d9b51002a",
        },
        {
          url: "https://res.cloudinary.com/dlvkf6kgm/image/upload/v1691828055/YelpCamp-remake/b8ao2tvj29bgchcpokbw.png",
          filename: "YelpCamp-remake/b8ao2tvj29bgchcpokbw",
          _id: "64d73f516d3e808d9b51002b",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni nulla hic reprehenderit, tempore sequi, dicta libero veritatis quos cupiditate aut incidunt voluptates dolorem, aliquid ipsum odit? Magni iusto officiis sint?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis dicta iste aspernatur iusto. Voluptatem necessitatibus facilis molestias inventore exercitationem recusandae dolorum deserunt iure tenetur, a officia, repellendus laudantium aliquam maiores.",
      location: `${cities[random].city}, ${cities[random].state}`,
      author: "64d86822f934bd79f0889b59",
      geometry: {
        type: "Point",
        coordinates: [cities[random].longitude, cities[random].latitude],
      },
    });
    await newCamp.save();
  }
};
// "64d86822f934bd79f0889b59"
// "64d63e1038531db317722845"

seedDB();



