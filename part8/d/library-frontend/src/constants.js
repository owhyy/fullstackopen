import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query Query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const MY_PROFILE = gql`
  query MyProfile {
    me {
      username
      id
      favoriteGenre
    }
  }
`;

export const ALL_BOOKS = gql`
  query AllBooks {
    allBooks {
      title
      published
      author {
        name
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation Mutation(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      id
      genres
      author
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation Mutation($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      id
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      password
    }
  }
`;
