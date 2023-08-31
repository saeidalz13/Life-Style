/* 
We type "#graphql" to ge the syntax highlighting
Data types in GQL:
- int
- String
- float
- boolean
- ID => key for data objects

- Query => This is MANDATORY
every schema needs one to define the entry point
*/
// export const typeDefs = `#graphql
//     type Plan {
//         id: ID!
//         email: string!
//         days: int!
//         plans: [dayPlan!]!
//     }

//     type dayPlan {
//         id: ID!
//         moves: [Move!]!
//     }

//     type Move {
//         id: ID!
//         name: String!
//         set: int!
//         rep: int!
//     }

//     type Query {
//         plans: [Plan]
//         dayPlans: [dayPlan]
//         moves: [Move]
//     }
// `;

// export const resolvers = {
//     Query: {
//         plans () {
//             return 
//         }
//     }
// }