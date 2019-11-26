const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connect = require('./database/database');

const Event = require('./models/event');
const User = require('./models/user');

// const graphqlSchema = require('./graphql/schema');
// const graphqlResolver = require('./graphql/resolvers');
// const auth = require('./middleware/auth');

const app = express();
const PORT = 3001;
connect();

// app.use(bodyParser.urlencoded());    // x-www-form-urlencoded
app.use(bodyParser.json());

const user = userId => {
    return User.findById(userId)
        .then( user => {
            return { ...user._doc, _id: user.id };
        })
        .catch( err => {
            throw err;
        });
}

app.use('/graphql',
    graphqlHttp({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
                creator: User!
            }

            type User {
                _id: ID!
                email: String!
                password: String
                createdEvents: [Event!]
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                .populate('creator')
                .then( events => {
                    return events.map( ev => {
                        return { ...ev._doc };
                    });
                })
                .catch( err => {
                    throw err;
                });
            },
            createEvent: args => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: '5ddd6ea11033182b40f9c6a6'
                });
                let createdEvent;
                return event
                .save()
                .then( result => {
                    createdEvent = { ...result._doc, creator: user.bind(this, result._doc.creator) };
                    return User.findById('5ddd6ea11033182b40f9c6a6');
                }).then( user => {
                    if(!user) {
                        throw new Error('User not found.')
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then( result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log("Error Event.save(): ", err);
                    throw err;
                });
            },
            createUser: args => {
                return User.findOne({ email: args.userInput.email }).then( user => {
                    if(user) {
                        throw new Error('User exists already ')
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then( hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then( result => {
                    return { ...result._doc, password: null };
                })
                .catch( err => {
                    throw err;
                })
                
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