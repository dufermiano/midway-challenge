const moment = require('moment-timezone');
const getUniquesAndSanitize = (source) => {
  // const idsToDelete = [];
  let idsToUpdate = [];

  const sanitizedProducts = source
    .map((item) => {
      // add a unique hash standarizing the fields to be checked
      const { value, name, type, size } = item;
      return {
        ...item,
        hash: JSON.stringify({
          value,
          name: name.toLowerCase(),
          type: type.toLowerCase(),
          size: size.toLowerCase(),
        }),
      };
    })
    .reduce((unique, item) => {
      // check if its unique

      const isDuplicated = unique.some((i) => {
        if (i.hash === item.hash) {
          idsToUpdate.push(i.id);
          // idsToDelete.push(item.id);
        }
        return i.hash === item.hash;
      });

      if (!isDuplicated) {
        unique.push(item);
      } else {
        unique.find((row) => {
          if (idsToUpdate.includes(row.id)) {
            row.inventory += item.inventory;
            let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
            row.updateDate = date;
            if (row.registrationDate) delete row.registrationDate;
          }
        });
      }

      return unique;
    }, [])
    .map((item) => {
      // remove hash property
      delete item.hash;
      return item;
    });

  idsToUpdate = [...new Set(idsToUpdate)];

  return {
    // idsToDelete,
    idsToUpdate,
    sanitizedProducts,
  };
};

module.exports = {
  getUniquesAndSanitize,
};
