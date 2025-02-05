import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({
  uri: 'http://localhost:9000/graphql',
});

const authHeaderLink = new ApolloLink((operation, forward) => {
  const accesToken = getAccessToken();

  if (accesToken) {
    operation.setContext({
      headers: {
        authorization: accesToken ? `Bearer ${accesToken}` : '',
      },
    });
  }

  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authHeaderLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    date
    company {
      name
      id
    }
  }
`;

const jobDetailQuery = gql`
  query ($id: ID!) {
    ...JobDetail
  }
  ${jobDetailFragment}
`;

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
      ${jobDetailFragment}
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({ query: jobDetailQuery, variables: { id: data.job.id }, data });
    },
  });
  return data.job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        date
        description
        id
        title
        company {
          name
          description
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query, fetchPolicy: 'network-only' });
  return data.jobs;
}

export async function getJob(id) {
  const { data } = await apolloClient.query({ query: jobDetailQuery, variables: { id } });
  return data.job;
}

export async function getCompany(id) {
  const query = gql`
    query Company($companyId: ID!) {
      company(id: $companyId) {
        description
        id
        name
      }
    }
  `;

  const { data } = await apolloClient.query({ query, variables: { companyId: id } });
  return data.company;
}
