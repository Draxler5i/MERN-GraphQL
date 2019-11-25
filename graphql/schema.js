const { buildSchema } = require('graphql');

const eventSchemas = require('./schemas/events');
const userSchemas = require('./schemas/user');

module.exports = buildSchema(`
    ${userSchemas.User}

    ${userSchemas.Event}

    ${userSchemas.AuthData}

    ${userSchemas.UserInputData}

    ${userSchemas.EventInputData}

    type RootQuery {
        ${userSchemas.UserQUeries}
        ${eventSchemas.EventQueries}
    }

    type RootMutation {
        ${userSchemas.UserMutations}
        ${eventSchemas.EventMutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
