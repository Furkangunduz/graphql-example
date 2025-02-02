import { gql, GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

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
  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJob(id) {
  const query = gql`
    query ($id: ID!) {
      job(id: $id) {
        id
        title
        description
        date
        company {
          id
        }
      }
    }
  `;

  const { job } = await client.request(query, { id });
  return job;
}
