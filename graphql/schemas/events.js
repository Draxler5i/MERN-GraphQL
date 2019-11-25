exports.Event = `
type Event {
    _id: ID!
    title: String!
    topic: String!
    description: String!
    price: Float!
    date: String!
    registeredUsers: [User!]!
}`;

exports.EventInputData = `
input EventInputData {
    title: String!
    topic: String!
    description: String!
    price: float!
    date: String!
}`;

exports.EventQueries = `
    events(booked: Boolean, byUser: Boolean): [Event!]!
`;

exports.EventMutations = `
    createEvent(eventInput: EventInputData!): Event!
    updateEvent(eventId: ID!, eventInput: EventInputData!): Event!
    bookEvent(eventId: ID!): Event!
    cancelEvent(eventId: ID!): Event!
`;
