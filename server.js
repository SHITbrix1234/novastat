const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 5000
var urlencodedParser = bodyParser.urlencoded({ limit: '1024mb', extended: true })
const math = require('mathjs')
const axios = require('axios');
const router = express.Router();


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/images'))
app.use(bodyParser.json({ limit: '1024mb' }));

app.set('views', './views');
app.set('view engine', 'ejs');


app.get('', (req, res) => {
    res.render('index');
})


async function getVehicleFilename(vehicleId) {
    try {
      const response = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets/${vehicleId}`);
      const vehicles = response.data.data.template.immutable_data.static;
      const vname = response.data.data.name;
  
      const allVehicles = {
        vehicle: `https://atomichub-ipfs.com/ipfs/${vehicles}`,
        vname: vname
      };
  
      return allVehicles;
    } catch (error) {
      console.error(error);
    }
  }

  async function getDriverFilename(driverId) {
    try {
      const response = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets/${driverId}`);
      const drivers = response.data.data.template.immutable_data.img;
      const dname = response.data.data.name;
  
      const allDrivers = {
        driver: `https://atomichub-ipfs.com/ipfs/${drivers}`,
        dname: dname
      };
  
      return allDrivers;
    } catch (error) {
      console.error(error);
    }
  }

async function getCopilotFilename(copilotId) {
    try {
      const response = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/assets/${copilotId}`);
      const copilots = response.data.data.template.immutable_data.img;
      const coname = response.data.data.name;
  
      const allCopilots = {
        copilot: `https://atomichub-ipfs.com/ipfs/${copilots}`,
        cname: coname
      };
  
      return allCopilots;
    } catch (error) {
      console.error(error);
    }
  }

  async function getTotal(user) {
    try {
      let page = 0;
      const size = 200;
      let races = [];
      let allRaces = [];
  
      do {
        const response = await axios.get('https://nr-api.win-win.software/api/v1/races/', {
          params: {
            currentAccount: user,
            isCurrentOnly: true,
            size: size,
            page: page,
          },
        });
  
        races = response.data.data;
        allRaces.push(...races);
        page++;
      } while (races.length === size);
  
      const totalRaces = allRaces.length;
      const positions = allRaces.map(race => race.player.position);
      const mode = math.mode(positions);
      const positionCount = allRaces.filter(race => [1, 2, 3].includes(race.player.position)).length;

      return {
        totalRaces: totalRaces,
        allRaces: allRaces,
        mode: mode,
        positionCount: positionCount
      };
      
    } catch (error) {
      console.error(error);
    }
  }
  





// app.post('/stat', urlencodedParser, async function (req, res) {
//   var user = req.body.username;
//   let page = 0;
//   const size = 200;
//   let races = [];
//   let allRaces = [];

//   do {
//       const response = await axios.get('https://nr-api.win-win.software/api/v1/races/', {
//           params: {
//               currentAccount: user,
//               isCurrentOnly: true,
//               size: size,
//               page: page,
//           },
//       });

//       races = response.data.data;
//       allRaces.push(...races);
//       page++;

//   } while (races.length === size);


//   const start = 0;
//   const end = 10;

//   const race = allRaces.slice(start, end);
//   const lnt = race.length;
//   const results = [];

//   for (let i = 0; i < lnt; i++) {

//     const vehicleId = race[i].player.vehicleAssetId;
//     const vehicleFilename = await getVehicleFilename(vehicleId);
  
//     const driverId = race[i].player.driver1AssetId;
//     const driverFilename = await getDriverFilename(driverId);
  
//     const copilotId = race[i].player.driver2AssetId;
//     const copilotFilename = await getCopilotFilename(copilotId);
  
//     const raceData = {
//       id: race[i].id,
//       vehicle: vehicleFilename.vehicle,
//       'vehicle-name': vehicleFilename.vname,
//       driver: driverFilename.driver,
//       'driver-name': driverFilename.dname,
//       copilot: copilotFilename.copilot,
//       'copilot-name': copilotFilename.cname,
//       league: race[i].player.league,
//       position: race[i].player.position,
//       time: race[i].player.timeMs,
//       boost: Boolean(race[i].player.useBoost),
//       status: race[i].player.status,
//       gear: race[i].player.gearId,
//     };
  
//     results.push(raceData);
//   }

//   const positions = allRaces.map(race => race.player.position);
//   const mode = math.mode(positions);
//   const totalRaces = allRaces.length;

//   // count the number of races with position 1, 2, or 3
//   const positionCount = allRaces.filter(race => [1, 2, 3].includes(race.player.position)).length;

//   res.render('stat', {
//     results,
//     allRaces,
//     start,
//     end,
//     user,
//     mode,
//     totalRaces,
//     positionCount,
//   });

// });

app.post('/stat', urlencodedParser, async function (req, res) {
  var user = req.body.username;
  let races = [];
  let allRaces = [];

  const response = await axios.get('https://nr-api.win-win.software/api/v1/races/', {
    params: {
      currentAccount: user,
      isCurrentOnly: true,
      size: 10,
      page: 0,
    },
  });

  races = response.data.data;
  allRaces.push(...races);

  
  const race = allRaces.slice(0, 10);
  const lnt = race.length;
  const results = [];

  for (let i = 0; i < lnt; i++) {
    const vehicleId = race[i].player.vehicleAssetId;
    const vehicleFilename = await getVehicleFilename(vehicleId);

    const driverId = race[i].player.driver1AssetId;
    const driverFilename = await getDriverFilename(driverId);

    const copilotId = race[i].player.driver2AssetId;
    const copilotFilename = await getCopilotFilename(copilotId);

    const raceData = {
      id: race[i].id,
      vehicle: vehicleFilename.vehicle,
      'vehicle-name': vehicleFilename.vname,
      driver: driverFilename.driver,
      'driver-name': driverFilename.dname,
      copilot: copilotFilename.copilot,
      'copilot-name': copilotFilename.cname,
      league: race[i].player.league,
      position: race[i].player.position,
      time: race[i].player.timeMs,
      boost: Boolean(race[i].player.useBoost),
      status: race[i].player.status,
      gear: race[i].player.gearId,
    };

    results.push(raceData);
  }


  res.render('stat', {
    results,
    user,
  });
});

  

app.post('/results', urlencodedParser, async function (req, res) {
    const start = req.body.start || 11;
    const end = req.body.end || 20;
    const allRaces = JSON.parse(req.body.allRaces);
    const race = allRaces.slice(start, end);
    const lnt = race.length;

    const results = [];
    for (let i = 0; i < lnt; i++) {
        const vehicleId = race[i].player.vehicleAssetId;
        const vehicleFilename = await getVehicleFilename(vehicleId);

        const driverId = race[i].player.driver1AssetId;
        const driverFilename = await getDriverFilename(driverId);

        const copilotId = race[i].player.driver2AssetId;
        const copilotFilename = await getCopilotFilename(copilotId);

        const raceData = {
        id: race[i].id,
        vehicle: vehicleFilename.vehicle,
        'vehicle-name': vehicleFilename.vname,
        driver: driverFilename.driver,
        'driver-name': driverFilename.dname,
        copilot: copilotFilename.copilot,
        'copilot-name': copilotFilename.cname,
        league: race[i].player.league,
        position: race[i].player.position,
        time: race[i].player.timeMs,
        boost: Boolean(race[i].player.useBoost),
        status: race[i].player.status,
        gear: race[i].player.gearId,
        };
        results.push(raceData);
    }
    res.json(results);
});

app.get('/getTotalRaces', async function(req, res) {
  const user = req.query.user;
  const { totalRaces, allRaces, mode, positionCount } = await getTotal(user);
  return res.json({ totalRaces, allRaces, mode, positionCount });
});




async function sleep(seconds){
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

app.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`))