const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const connect = require('./database/database');

const event = require('./models/event');

// const graphqlSchema = require('./graphql/schema');
// const graphqlResolver = require('./graphql/resolvers');
// const auth = require('./middleware/auth');

const app = express();
const PORT = 3001;
connect();
const events = [];

// app.use(bodyParser.urlencoded());    // x-www-form-urlencoded
app.use(bodyParser.json());

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput :EventInput): Event
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return events;
            },
            createEvent: (args) => {
                // const event = {
                //     _id: Math.random().toString(),
                //     title: args.eventInput.title,
                //     description: args.eventInput.description,
                //     price: +args.eventInput.price,
                //     date: args.eventInput.date
                // }
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                });

                events.push(event);
                return event;
            }
        },
        graphiql: true
        // schema: graphqlSchema,
        // rootValue: graphqlResolver,
        // graphiql: true,
        // formatError(err) {
        //     if (!err.originalError) {
        //         return err;
        //     }
        //     const data = err.originalError.data;
        //     const message = err.message || 'An error ocurred.';
        //     const code = err.originalError.code || 500;
        //     return { message: message, status: code, data: data };
        // }
    })
);

// app.use( (req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//     );
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// app.use(auth);

// app.use( (error, req, res, next) => {
//     console.log(error);
    
// });

app.listen(PORT, () => console.log(`Server to GraphQL is running on ${PORT}`));