const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Person = require("./models/person");
const User = require("./models/user");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to ", MONGODB_URI);
  })
  .catch((error) => {
    console.log("error connecting to MongoDB: ", error.message);
  });

const typeDefs = `
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
      addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
      ): Person
      editNumber(
        id: ID!
        phone: String!
      ): Person
      createUser(
        username: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
      addAsFriend(
        name: String!
      ): User
  }
`;

const resolvers = {
  Query: {
    personCount: async () => Person.find({}).length,
    allPersons: async (_, args) => {
      if (!args.phone) {
        return Person.find({});
      }
      return Person.find({ phone: { $exists: args.phone === "YES" } });
    },
    findPerson: async (_, args) => Person.findOne({ name: args.name }),
    me: async (_, args, context) => {
      return context.currentUser;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  Mutation: {
      addPerson: async (_, args, {currentUser}) => {
      if (!currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      if (await Person.findOne({ name: args.name })) {
        throw new GraphQLError("Name must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const person = new Person({ ...args });
      try {
        await person.save();
        currentUser.firends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError("Saving user failed", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.name, error },
        });
      }
      return person;
    },
    editNumber: async (_, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return null;

      person.phone = args.phone;
      try {
        person.save();
      } catch (error) {
        throw new GraphQLError("Saving person failed", {
          extensions: { code: "BAD_USER_INPUT", invalidArgs: args.name, error },
        });
      }

      return person;
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addAsFriend: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });

      const isFriend = (person) =>
        currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      const person = await Person.findOne({ name: args.name });
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person);
      }

      await currentUser.save();
      return currentUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );
      const currentUser = await User.findById(decodedToken.id).populate(
        "friends",
      );
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
