const instance = require("./instance");

async function fetchDeliveryPlaces() {
  try {
    const { data: places } = await instance.get("/places");
    return places;
  } catch (error) {
    console.log(error);
  }
}

function messagePlaces(places = [{}]) {
  const data = places.map((place, index) => ({
    body: `*${index + 1}.-* *${place.name}*\n*Dirección:* ${
      place.address
    } *CP*: ${place.cp}\n*Horario* de ${place.open_h} a ${place.close_h}`,
  }));

  return data;
}

module.exports = { fetchDeliveryPlaces, messagePlaces };
