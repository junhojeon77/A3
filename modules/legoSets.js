const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      setData.forEach((setDataObj) => {
        let themeObj = themeData.find(
          (theme) => theme.id === setDataObj.theme_id
        );

        if (themeObj) {
          let newSet = {
            set_num: setDataObj.set_num,
            name: setDataObj.name,
            year: setDataObj.year,
            theme_id: setDataObj.theme_id,
            num_parts: setDataObj.num_parts,
            img_url: setDataObj.img_url,
            theme: themeObj.name,
          };
          sets.push(newSet);
        } else {
          console.error("Theme not found");
        }
      });
      resolve(sets);
    } catch (error) {
      reject(error);
    }
  });
}

function getAllSets() {
  return new Promise((resolve) => {
    resolve(sets);
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    try {
      let searchSet = sets.find((set) => set.set_num === setNum);
      resolve(searchSet);
    } catch (error) {
      reject(error);
    }
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    try {
      const convertLower = theme.toLowerCase();
      const searchTheme = sets.filter((set) =>
        set.theme.toLowerCase().includes(convertLower)
      );
      resolve(searchTheme);
    } catch (error) {
      reject(error);
    }
  });
}

initialize()
  .then(() => {
    getAllSets().then(console.log);

    getSetByNum("045-1").then(console.log);

    getSetsByTheme("town").then(console.log);
  })
  .catch((error) => console.error("Error during initialization:", error));

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

