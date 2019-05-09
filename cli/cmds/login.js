const ora = require('ora');
const axios = require('axios');

module.exports = async (args) => {
  const spinner = ora().start()

  axios.get('http://localhost:8080').then((value) => {
    console.log(value.data.status);
  })

  await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
  })

  spinner.stop();
  console.log('you are logged in');
}