exports.User = `
type User {
    _id: ID!
    email: String!
    password: String
}`;

exports.AuthData = `
type AuthData {
    token: String!
    userId: String!
}`;

exports.UserInputData = `
input UserInputData {
    email: String!
    password: String!
}`;

exports.UserQueries = `
    login(email: String!, password: String!): AuthData!
`;

exports.UserMutations = `
    createUser(userInput: UserInputData!): User!
`;
