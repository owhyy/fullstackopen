const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // allows queries without filter to return all documents (false by default)

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { GraphQLError } = require("graphql");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to ", MONGODB_URI);
  })
  .catch((err) => {
    console.log("error: ", err.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
    me: User
  }

  type Mutation{
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
        ): Book
    editAuthor(
        id: ID!
        name: String
        born: Int
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root }),
  },
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (_, args) => {
      let filterArgs = [];
      if (args.author) filterArgs.push({ "author.name": args.author });
      if (args.genre) filterArgs.push({ genres: { $in: args.genre } });
	return Book.find(filterArgs.count ? { $and: filterArgs } : {}).populate("author");
    },
    allAuthors: async () => Author.find(),
    me: async (_, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = Author({ name: args.author, born: null });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Invalid author name", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }
      console.log(author);

      const book = Book({ ...args, author: author });
      console.log(book);
      try {
        const savedBook = await book.save();
      } catch (error) {
        throw new GraphQLError("Invalid input", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
      return savedBook;
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });

      const author = await Author.findOne({ _id: args.id });
      console.log(author);
      if (!author) return null;

      if (args.born) author.born = args.born;
      if (args.name) author.name = args.name;

      try {
        var updatedAuthor = await author.save();
      } catch (error) {
        throw new GraphQLError("Invalid input", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
      return updatedAuthor;
    },
    createUser: async (_, args) => {
      const user = User({ ...args });
      try {
        var createdUser = await user.save();
      } catch (error) {
        throw new GraphQLError("invalid input", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return createdUser;
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
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
