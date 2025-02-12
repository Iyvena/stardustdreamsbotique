const app = require('./app');
const { config } = require('./config/dotenvConfig');

app.listen(config.PORT, () => {
    console.log('https://nodejs313.dszcbaross.edu.hu');
});