maptilersdk.config.apiKey = mapTilerToken;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.HYBRID,
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
  `<h3>${campground.title}</h3>
  <p>${campground.location}</p>
  `
);

const marker = new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
