const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Import all function modules
const transferProperty = require('./1_propertyTransfer');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'RealEstate App');

app.get('/', (req, res) => res.send('hello world'));

app.post('/transferProperty', (req, res) => {

  currentState.execute(req.body.ownerName, req.body.surveyNo)
    .then((viewCurrentStateOfProperty) => {
      console.log('viewCurrentStateOfProperty to consumer');
      let message = '';
      // validate if the property has double ownership (if any loan on property then the bank will have share)
      if (viewCurrentStateOfProperty.isAllowedToTransfer) {
        // once the property has the single ownership check the transaction purpose
        // 1. Sell
        // 2. Lease
        // 3. Loan on property
        switch (req.body.transactionType) {
          case 'SELL': {
            // transfer complete ownership
            message = 'Sell';
          }
          case 'LOAN': {
            // transfer the request to opted bank
            message = 'Loan';
          }
          case 'LEASE': {
            // transfer the partial rights for an specified time period
            message = 'Lease';
          }
        }
        // once the transactionType identified then the respective transaction has to happen
        // this represents only the Sell property which case: 1
        transferProperty.execute(req.body.newOwnerName, req.body.surveyNo, req.body.transactionDate, message)
          .then((property) => {
            console.log('Add New owner to the property to network');
            const result = {
              status: 'success',
              message: 'Add New Owner to the property to network',
              property: property
            };
            res.json(result);
          })
          .catch((e) => {
            const result = {
              status: 'error',
              message: 'Failed',
              error: e
            };
            res.status(500).send(result);
          });
      }
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed',
        error: e
      };
      res.status(500).send(result);
    });
});


app.post('/viewCurrentStateOfProperty', (req, res) => {
  currentState.execute(req.body.ownerName, req.body.surveyNo)
    .then((viewCurrentStateOfProperty) => {
      console.log('viewCurrentStateOfProperty to consumer');
      let message = '';
      // validate if the property has double ownership (if any loan on property then the bank will have share)
      if (viewCurrentStateOfProperty.isAllowedToTransfer) {
        message = 'It is allowed to sell';
      } else {
        message = 'It is not allowed to sell';
      }
      const result = {
        status: 'success',
        message: message,
        viewCurrentStateOfProperty: viewCurrentStateOfProperty
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed',
        error: e
      };
      res.status(500).send(result);
    });
});

app.listen(port, () => console.log(`Distributed RealEstate App listening on port ${port}!`));