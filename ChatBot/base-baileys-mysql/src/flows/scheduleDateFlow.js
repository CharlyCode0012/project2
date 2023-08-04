const { addKeyword } = require("@bot-whatsapp/bot");
const instance = require("../request/instance.js");

let folio;
const regexDate =
  /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;

const scheduleDateFlow = addKeyword(["Agendar", "Agendar fecha", "Agenda"])
  .addAnswer(
    ["Ingrese el folio para agendar cita: "],
    { capture: true, delay: 1000 },
    async (ctx, { fallBack, flowDynamic }) => {
      const getFolio = async () => {
        try {
          const isFolio = await instance.get("/deliveries/searchByFolio", {
            params: { search: ctx.body },
          });
          if (isFolio) folio = ctx.body;
          else return fallBack();
        } catch (error) {
          console.error(error);
        }
      };

      await flowDynamic(getFolio());
    }
  )
  .addAnswer(
    ["Ingrese la fecha en formato *DD/MM/AAAA*:"],
    {
      capture: true,
      delay: 1000,
    },
    async (ctx, { fallBack, flowDynamic }) => {
      const date_delivery = ctx.body;
      if (!regexDate.test(date_delivery)) return fallBack();

      try {
        await instance.put(`/deliveries/folio/${folio}`, { date_delivery });
        await flowDynamic({body: "Se envío con exito"});
      } catch (error) {
        console.error(error);
      }
    }
  );

module.exports = { scheduleDateFlow };
