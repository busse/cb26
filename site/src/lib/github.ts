// GitHub API utilities for fetching repository data at build time

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
}

/**
 * Fetch pinned repositories for a GitHub user
 * Uses the GitHub GraphQL API
 */
export async function fetchPinnedRepos(username: string): Promise<GitHubRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping GitHub API fetch');
    return [];
  }

  const query = `
    query {
      user(login: "${username}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              repositoryTopics(first: 5) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              updatedAt
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const repos = data?.data?.user?.pinnedItems?.nodes || [];

    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name || null,
      topics: repo.repositoryTopics?.nodes?.map((t: any) => t.topic.name) || [],
      updatedAt: repo.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    return [];
  }
}

/**
 * Fetch a specific repository's data
 */
export async function fetchRepo(owner: string, name: string): Promise<GitHubRepo | null> {
  const token = import.meta.env.GITHUB_TOKEN;
  
  if (!token) {
    console.warn('GITHUB_TOKEN not set, skipping GitHub API fetch');
    return null;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repo = await response.json();

    return {
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
    };
  } catch (error) {
    console.error(`Failed to fetch repo ${owner}/${name}:`, error);
    return null;
  }
}
