import { GraphQLError } from 'graphql';
import { getCompanies, getCompany } from './db/companies.js';
import { createJob as createJobDb, deleteJob, getJob, getJobs, updateJob } from './db/jobs.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`Job with id ${id} not found`);
      }
      return job;
    },

    companies: () => getCompanies(),
    company: async (_root, { id }) => {
      const company = await getCompany(id);

      if (!company) {
        throw notFoundError(`Company with id ${id} not found`);
      }

      return company;
    },
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, { auth, user }) => {
      const isAuthenticated = auth;

      if (!isAuthenticated) {
        throw notAuthenticatedError('You must be authenticated to create a job');
      }

      const companyId = user.companyId;

      const company = await getCompany(companyId);
      if (!company) {
        throw new GraphQLError(`Company with id ${companyId} does not exist`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const job = await createJobDb({ title, description, companyId });
      if (!job) {
        throw new GraphQLError('Failed to create job', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }

      return job;
    },
    updateJob: async (_root, { id, input: { title, description } }, { auth, user }) => {
      const isAuthenticated = auth;

      if (!isAuthenticated) {
        throw notAuthenticatedError('You must be authenticated to create a job');
      }

      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`Job with id ${id} not found`);
      }

      const updated = await updateJob({ id, title, description });

      if (!updated) {
        throw serverError('Failed to update job');
      }

      return updated;
    },
    deleteJob: async (_root, { id }, { auth, user }) => {
      const isAuthenticated = auth;

      if (!isAuthenticated) {
        throw notAuthenticatedError('You must be authenticated to create a job');
      }

      const job = await getJob(id);
      if (!job) {
        throw notFoundError(`Job with id ${id} not found`);
      }

      const deleted = await deleteJob(id);
      if (!deleted) {
        throw serverError('Failed to delete job');
      }

      return job;
    },
  },
  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

function notAuthenticatedError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  });
}

function serverError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}
