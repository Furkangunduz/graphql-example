import { getCompanies, getCompany } from './db/companies.js';
import { getJob, getJobs } from './db/jobs.js';

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
    job: (_root, { id }) => getJob(id),

    companies: () => getCompanies(),
    company: (_root, { id }) => getCompany(id),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}
