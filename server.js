/********************************************************************************* 
 * WEB322 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:*
 * 
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * 
 *  Name: Jun Ho Jeon Student ID: 173583212 Date: 02/16/2024
 *  Published URL: https://olive-brown-bear-tux.cyclic.app/
 * 
 *********************************************************************************/

const express = require('express');
const app = express();
const legoData = require("./modules/legoSets");

const HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

legoData.initialize()
  .then(() => {
    app.get('/', (req, res) => {
      res.render('home', { page: '/' });
    });

    app.get('/about', (req, res) => {
      res.render("about");
    });

    app.get('/lego/sets', (req, res) => {
      const theme = req.query.theme;
      if (theme) {
          legoData.getSetsByTheme(theme)
              .then(sets => {
                  if (sets.length === 0) {
                    res.render('404');
                  } else {
                      res.render('sets', { sets: sets }); 
                  }
              })
              .catch(error => {
                  console.error('Error getting sets by theme:', error);
                  res.status(500).send('Internal Server Error');
              });
      } else {
          legoData.getAllSets()
              .then(allSets => res.render('sets', { sets: allSets })) 
              .catch(error => {
                  console.error('Error getting all sets:', error);
                  res.status(500).send('Internal Server Error');
              });
      }
    });

    app.get('/lego/sets/:setNum', (req, res) => {
      const setNum = req.params.setNum;
      legoData.getSetByNum(setNum)
        .then(set => {
          if (set) {
            res.render('set', { set: set }); 
          } else {
            res.render('404');
          }
        })
        .catch(error => {
          console.error('Error getting set by number:', error);
          res.status(500).send('Internal Server Error');
        });
    });

    app.get('/lego/sets/:theme-demo', (req, res) => {
      const theme = 'UFO'; 
      legoData.getSetsByTheme(theme)
        .then((sets) => {
          res.json(sets);
        })
        .catch((error) => {
          console.error('Error getting sets by theme:', error);
          res.status(500).send('Internal Server Error');
        });
    });

    app.use((req, res) => {
      res.render("404");
    });

    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch(error => {
    console.error('Error initializing Lego data:', error);
  });
