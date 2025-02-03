import { gql, GraphQLClient } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', {
  headers: () => {
    const token = getAccessToken();

    return {
      authorization: token ? `Bearer ${token}` : '',
    };
  },
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
      job: createJob(input: $input) {
        date
        description
        id
        title
        company {
          name
          id
        }
      }
    }
  `;

  const { job } = await client.request(mutation, {
    input: { title, description },
  });

  return job;
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
          name
          id
        }
      }
    }
  `;

  const { job } = await client.request(query, { id });
  return job;
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

  const { company } = await client.request(query, { companyId: id });

  return company;
}
